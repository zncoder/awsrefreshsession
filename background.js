function refresh() {
  chrome.storage.local.get(['ssoUrl'], items => {
    if (items.ssoUrl) {
      chrome.tabs.create({url: items.ssoUrl}, tab => ssoTabCreated(tab.id))
    } else {
      chrome.runtime.openOptionsPage()
    }
  })
}

function ssoTabCreated(tid) {
  console.log(`${tid} created`)

  let checkTabReady = () => {
    chrome.tabs.get(tid, (tab) => {
      console.log(`get tab:${tid} ${tab}`)
      if (tab.title === "AWS Management Console") {
        console.log(`${tab.id} ${tab.url} ready`)
        chrome.tabs.remove(tid, () => { reloadAwsTabs() })
        return
      }
      setTimeout(checkTabReady, 1000)
    })
  }

  console.log("check")
  setTimeout(checkTabReady, 1000)
}

function reloadAwsTabs() {
  chrome.tabs.query({url: "https://console.aws.amazon.com/*"}, tabs => {
    for (let t of tabs) {
      console.log(`reload ${t.id}:${t.url}`)
      chrome.tabs.reload(t.id, () => {
        if (chrome.runtime.lastError) {
          console.log(`reload err:${chrome.runtime.lastError.message}`)
        }
      })
    }
  })
}

function init() {
  chrome.browserAction.onClicked.addListener(refresh)
}

init()
