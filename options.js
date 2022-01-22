function saveOptions() {
  let ssoUrl = document.querySelector("#ssoUrl").value
  console.log(`save ${ssoUrl}`)
  chrome.storage.local.set({
    ssoUrl: ssoUrl
  }, function() {
    let status = document.querySelector("#status")
    status.textContent = "Saved"
    setTimeout(retryRefresh, 1000)
  })
}

function retryRefresh() {
  window.close()
  chrome.extension.getBackgroundPage().refresh()
}

document.querySelector("#save").addEventListener("click", saveOptions)
