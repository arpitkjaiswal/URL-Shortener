// -------------------------------------------------------------
// SnapLink Application Logic
// -------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const shortenForm = document.getElementById("shorten-form");
  const longUrlInput = document.getElementById("long-url");
  const submitBtn = document.getElementById("submit-btn");
  const resultSection = document.getElementById("result-section");
  const shortenedUrlText = document.getElementById("shortened-url-text");
  const copyBtn = document.getElementById("copy-btn");
  const qrBtn = document.getElementById("qr-btn");
  const qrContainer = document.getElementById("qr-container");
  const qrImage = document.getElementById("qr-image");
  const qrDownload = document.getElementById("qr-download");
  const historyGrid = document.getElementById("history-grid");
  const emptyState = document.getElementById("empty-state");
  const historyCount = document.getElementById("history-count");

  // Settings Panel Elements
  const settingsToggleBtn = document.getElementById("settings-toggle-btn");
  const settingsPanel = document.getElementById("settings-panel");
  const customBaseUrlInput = document.getElementById("custom-base-url");

  // Modal Elements
  const analyticsModal = document.getElementById("analytics-modal");
  const modalShortId = document.getElementById("modal-short-id");
  const statTotalClicks = document.getElementById("stat-total-clicks");
  const statCreatedDate = document.getElementById("stat-created-date");
  const modalDestUrl = document.getElementById("modal-dest-url");
  const clicksListBody = document.getElementById("clicks-list-body");
  const closeModalBtn = document.getElementById("close-modal-btn");

  // Local State
  let history = JSON.parse(localStorage.getItem("snaplink_history")) || [];
  let clicksChart = null; // Chart.js instance ref
  let currentGeneratedUrl = "";

  // Initialize Settings
  customBaseUrlInput.value = localStorage.getItem("snaplink_custom_base_url") || "";

  // Toggle Settings Panel
  settingsToggleBtn.addEventListener("click", () => {
    settingsPanel.classList.toggle("hidden");
  });

  // Handle Custom Domain changes
  customBaseUrlInput.addEventListener("input", (e) => {
    const val = e.target.value.trim();
    localStorage.setItem("snaplink_custom_base_url", val);
    renderHistory(); // Re-render history list instantly with new domain
    
    // Also update current displayed generated link if one is active
    if (currentGeneratedUrl && !resultSection.classList.contains("hidden")) {
      const shortId = currentGeneratedUrl.split("/").pop();
      const newBase = val || window.location.origin;
      currentGeneratedUrl = `${newBase.replace(/\/$/, '')}/${shortId}`;
      shortenedUrlText.textContent = currentGeneratedUrl;
    }
  });

  // Initialize Lucide Icons
  lucide.createIcons();

  // Load and Render History on init
  renderHistory();

  // Handle Form Submit
  shortenForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const redirectUrl = longUrlInput.value.trim();

    if (!redirectUrl) return;

    // Loading State
    setSubmitLoading(true);

    try {
      const response = await fetch("/url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ redirectUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL. Please try again.");
      }

      const data = await response.json();
      const shortId = data.shortId;
      const baseUrl = customBaseUrlInput.value.trim() || window.location.origin;
      const shortUrl = `${baseUrl.replace(/\/$/, '')}/${shortId}`;
      currentGeneratedUrl = shortUrl;

      // Save to localStorage history
      const newLink = {
        shortId,
        redirectUrl,
        createdAt: new Date().toISOString(),
        clicks: 0,
      };

      // Check if already exists, if so remove old one to move it to the top
      history = history.filter(link => link.redirectUrl !== redirectUrl);
      history.unshift(newLink);
      localStorage.setItem("snaplink_history", JSON.stringify(history));

      // Display result
      showResult(shortUrl);
      
      // Reset form
      longUrlInput.value = "";
      
      // Update UI history
      renderHistory();
      
      showToast("Link shortened successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast(err.message || "An error occurred", "error");
    } finally {
      setSubmitLoading(false);
    }
  });

  // Action Buttons: Copy
  copyBtn.addEventListener("click", () => {
    copyToClipboard(currentGeneratedUrl, copyBtn);
  });

  // Action Buttons: QR Code
  qrBtn.addEventListener("click", () => {
    if (qrContainer.classList.contains("hidden")) {
      // Fetch QR Code from QRServer API
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentGeneratedUrl)}`;
      qrImage.src = qrApiUrl;
      qrDownload.href = qrApiUrl;
      
      qrContainer.classList.remove("hidden");
      qrBtn.classList.add("copied"); // style changes
      showToast("QR Code generated!", "info");
    } else {
      qrContainer.classList.add("hidden");
      qrBtn.classList.remove("copied");
    }
  });

  // Close Modal Handler
  closeModalBtn.addEventListener("click", closeAnalytics);
  analyticsModal.addEventListener("click", (e) => {
    if (e.target === analyticsModal) closeAnalytics();
  });

  // Helper: Set Button Loading State
  function setSubmitLoading(isLoading) {
    if (isLoading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="loading-spinner"></span>
        <span>Shrinking...</span>
      `;
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span>Shrink</span>
        <i data-lucide="arrow-right"></i>
      `;
      lucide.createIcons();
    }
  }

  // Helper: Show Result Card
  function showResult(shortUrl) {
    shortenedUrlText.textContent = shortUrl;
    resultSection.classList.remove("hidden");
    qrContainer.classList.add("hidden");
    qrBtn.classList.remove("copied");
    
    // Smooth scroll to result
    resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // Helper: Copy URL to Clipboard
  function copyToClipboard(text, buttonElement) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied to clipboard!", "success");
      
      const originalHtml = buttonElement.innerHTML;
      buttonElement.classList.add("copied");
      buttonElement.innerHTML = `
        <i data-lucide="check" class="btn-icon"></i>
        <span>Copied!</span>
      `;
      lucide.createIcons();

      setTimeout(() => {
        buttonElement.classList.remove("copied");
        buttonElement.innerHTML = originalHtml;
        lucide.createIcons();
      }, 2000);
    }).catch(err => {
      console.error("Clipboard copy failed", err);
      showToast("Failed to copy", "error");
    });
  }

  // Helper: Render History List
  async function renderHistory() {
    if (history.length === 0) {
      emptyState.classList.remove("hidden");
      historyGrid.classList.add("hidden");
      historyCount.textContent = "0 Links";
      return;
    }

    emptyState.classList.add("hidden");
    historyGrid.classList.remove("hidden");
    historyCount.textContent = `${history.length} Link${history.length > 1 ? 's' : ''}`;

    // Clear grid first
    historyGrid.innerHTML = "";

    // Generate elements
    history.forEach((link, index) => {
      const baseUrl = customBaseUrlInput.value.trim() || window.location.origin;
      const computedShortUrl = `${baseUrl.replace(/\/$/, '')}/${link.shortId}`;

      const card = document.createElement("div");
      card.className = "glass-card history-card";
      card.innerHTML = `
        <div class="link-info">
          <a href="${computedShortUrl}" target="_blank" class="short-url-link-small">
            ${computedShortUrl.replace(/^https?:\/\//, '')}
            <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
          </a>
          <div class="original-url-small" title="${link.redirectUrl}">${link.redirectUrl}</div>
        </div>
        <div class="link-meta">
          <div class="clicks-badge" id="clicks-badge-${link.shortId}">
            <i data-lucide="mouse-pointer-click"></i>
            <span class="count">- clicks</span>
          </div>
          <button class="btn-circle copy-history-btn" data-url="${computedShortUrl}" title="Copy Link">
            <i data-lucide="copy" style="width: 16px; height: 16px;"></i>
          </button>
          <button class="btn-circle analytics-btn" data-id="${link.shortId}" title="View Live Analytics">
            <i data-lucide="bar-chart-2" style="width: 16px; height: 16px;"></i>
          </button>
          <button class="btn-circle delete-btn" data-index="${index}" title="Remove from History" style="color: var(--danger);">
            <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
          </button>
        </div>
      `;
      historyGrid.appendChild(card);
    });

    // Re-initialize icons in the history list
    lucide.createIcons();

    // Attach Action Event Listeners
    document.querySelectorAll(".copy-history-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const url = btn.getAttribute("data-url");
        copyToClipboard(url, btn);
      });
    });

    document.querySelectorAll(".analytics-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const shortId = btn.getAttribute("data-id");
        openAnalytics(shortId);
      });
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = parseInt(btn.getAttribute("data-index"));
        deleteHistoryItem(index);
      });
    });

    // Dynamically fetch and update clicks counter for each link
    history.forEach(async (link) => {
      try {
        const res = await fetch(`/url/analytics/${link.shortId}`);
        if (res.ok) {
          const stats = await res.json();
          const badgeEl = document.getElementById(`clicks-badge-${link.shortId}`);
          if (badgeEl) {
            badgeEl.querySelector(".count").textContent = `${stats.totalclicks} click${stats.totalclicks !== 1 ? 's' : ''}`;
            // Update local clicks cache
            link.clicks = stats.totalclicks;
          }
        }
      } catch (err) {
        console.error("Error loading click stats for " + link.shortId, err);
      }
    });
  }

  // Delete item from History list
  function deleteHistoryItem(index) {
    const link = history[index];
    history.splice(index, 1);
    localStorage.setItem("snaplink_history", JSON.stringify(history));
    renderHistory();
    showToast("Link removed from history list", "info");
    
    // Hide result section if it was displaying the deleted link
    const baseUrl = customBaseUrlInput.value.trim() || window.location.origin;
    const computedShortUrl = `${baseUrl.replace(/\/$/, '')}/${link.shortId}`;
    if (resultSection.classList.contains("hidden") === false && shortenedUrlText.textContent === computedShortUrl) {
      resultSection.classList.add("hidden");
    }
  }

  // Open Detailed Analytics modal
  async function openAnalytics(shortId) {
    const linkData = history.find(l => l.shortId === shortId);
    if (!linkData) return;

    // Show modal drawer with loader
    analyticsModal.classList.remove("hidden");
    document.body.style.overflow = "hidden"; // Disable background scrolling

    // Temporary Loading content
    modalShortId.textContent = `/${shortId}`;
    statTotalClicks.textContent = "Loading...";
    statCreatedDate.textContent = formatDate(linkData.createdAt);
    modalDestUrl.textContent = linkData.redirectUrl;
    modalDestUrl.href = linkData.redirectUrl;
    clicksListBody.innerHTML = `<tr><td colspan="3" style="text-align: center;">Fetching statistics...</td></tr>`;

    try {
      const res = await fetch(`/url/analytics/${shortId}`);
      if (!res.ok) {
        throw new Error("Could not retrieve analytics data.");
      }
      
      const data = await res.json();
      
      // Update basic details
      statTotalClicks.textContent = data.totalclicks;
      
      // Populate Click logs table
      if (!data.analytics || data.analytics.length === 0) {
        clicksListBody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--text-muted);">No clicks recorded yet. Share your short URL to see activity.</td></tr>`;
      } else {
        clicksListBody.innerHTML = "";
        
        // Reverse array to show recent first
        const reverseClicks = [...data.analytics].reverse();
        reverseClicks.forEach((click, idx) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${reverseClicks.length - idx}</td>
            <td>${formatDateTime(click.timestamp)}</td>
            <td><span class="status-badge" style="background: rgba(16, 185, 129, 0.1); color: var(--success); padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">Redirected</span></td>
          `;
          clicksListBody.appendChild(tr);
        });
      }

      // Draw Chart
      renderChart(data.analytics);

    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to load live analytics", "error");
      clicksListBody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: var(--danger);">${err.message}</td></tr>`;
    }
  }

  // Close Analytics Modal
  function closeAnalytics() {
    analyticsModal.classList.add("hidden");
    document.body.style.overflow = ""; // Re-enable background scrolling
  }

  // Render Chart.js Graph
  function renderChart(clicksData) {
    const ctx = document.getElementById("clicks-chart").getContext("2d");

    // Destroy existing chart if it exists
    if (clicksChart) {
      clicksChart.destroy();
    }

    if (!clicksData || clicksData.length === 0) {
      // Draw empty placeholder chart
      clicksChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['No Clicks Yet'],
          datasets: [{
            label: 'Clicks',
            data: [0],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: getChartOptions()
      });
      return;
    }

    // Group clicks by date
    const dateCounts = {};
    clicksData.forEach(click => {
      const dateStr = formatDateLabel(click.timestamp);
      dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
    });

    const labels = Object.keys(dateCounts);
    const counts = Object.values(dateCounts);

    // Limit to last 7 days of activity if there's too much data
    // Or just display whatever dates have data
    clicksChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Clicks',
          data: counts,
          borderColor: '#0ea5e9',
          borderWidth: 3,
          backgroundColor: 'rgba(14, 165, 233, 0.15)',
          fill: true,
          tension: 0.35,
          pointBackgroundColor: '#0ea5e9',
          pointBorderColor: '#fff',
          pointBorderWidth: 1.5,
          pointHoverRadius: 6,
          pointRadius: 4
        }]
      },
      options: getChartOptions()
    });
  }

  // Chart Styling config
  function getChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: '#1e293b',
          titleColor: '#f8fafc',
          bodyColor: '#cbd5e1',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 10,
          displayColors: false
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            color: '#64748b',
            font: {
              family: 'Plus Jakarta Sans',
              size: 10
            }
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#64748b',
            stepSize: 1,
            precision: 0,
            font: {
              family: 'Plus Jakarta Sans',
              size: 10
            }
          },
          min: 0
        }
      }
    };
  }

  // Date Formatting Helpers
  function formatDate(isoStr) {
    if (!isoStr) return "-";
    const date = new Date(isoStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  function formatDateTime(isoStr) {
    if (!isoStr) return "-";
    const date = new Date(isoStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  }

  function formatDateLabel(isoStr) {
    if (!isoStr) return "";
    const date = new Date(isoStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });
  }

  // Toast System Function
  function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    let iconName = "info";
    if (type === "success") iconName = "check-circle-2";
    if (type === "error") iconName = "alert-triangle";
    
    toast.innerHTML = `
      <i data-lucide="${iconName}"></i>
      <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    lucide.createIcons(); // render the icon inside toast

    // Remove toast after animation
    setTimeout(() => {
      toast.style.animation = "toast-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards";
      // Add out keyframes dynamically if needed, or define in CSS:
      // We can define it in style.css or just remove the element
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  }
});
