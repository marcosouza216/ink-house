import Cocoa
import WebKit

let width: CGFloat = 390
let height: CGFloat = 844
let base = "http://127.0.0.1:8765"
let outDir = CommandLine.arguments.count > 1
  ? CommandLine.arguments[1]
  : FileManager.default.currentDirectoryPath + "/docs/user-guide/images"

struct Job {
  let url: String
  let file: String
  let js: String
}

let jobs: [Job] = [
  Job(url: "\(base)/contact.html", file: "08-contact.png", js: "const el=document.querySelector('.contact-section')||document.querySelector('.contact-grid'); if(el) window.scrollTo(0, el.getBoundingClientRect().top+window.scrollY-72);")
]

class Capturer: NSObject, WKNavigationDelegate {
  let webView: WKWebView
  let window: NSWindow
  var remaining: [Job]
  var current: Job?

  override init() {
    let config = WKWebViewConfiguration()
    config.websiteDataStore = .nonPersistent()
    let wv = WKWebView(frame: NSRect(x: 0, y: 0, width: width, height: height), configuration: config)
    wv.customUserAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1"
    let win = NSWindow(
      contentRect: NSRect(x: 40, y: 40, width: width, height: height),
      styleMask: [.borderless],
      backing: .buffered,
      defer: false
    )
    win.isReleasedWhenClosed = false
    win.contentView = wv
    win.setContentSize(NSSize(width: width, height: height))
    win.orderFrontRegardless()
    self.webView = wv
    self.window = win
    self.remaining = jobs
    super.init()
    wv.navigationDelegate = self
  }

  func start() {
    try? FileManager.default.createDirectory(atPath: outDir, withIntermediateDirectories: true)
    next()
  }

  func next() {
    guard !remaining.isEmpty else {
      DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) { NSApp.terminate(nil) }
      return
    }
    current = remaining.removeFirst()
    print("loading \(current!.file)")
    webView.load(URLRequest(url: URL(string: current!.url)!))
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    DispatchQueue.main.asyncAfter(deadline: .now() + 2.8) {
      let js = self.current?.js ?? ""
      if js.isEmpty {
        self.snap()
      } else {
        webView.evaluateJavaScript(js) { _, _ in
          DispatchQueue.main.asyncAfter(deadline: .now() + 0.7) { self.snap() }
        }
      }
    }
  }

  func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
    fputs("nav fail \(error.localizedDescription)\n", stderr)
    next()
  }

  func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
    fputs("prov fail \(error.localizedDescription)\n", stderr)
    next()
  }

  func snap() {
    let cfg = WKSnapshotConfiguration()
    cfg.rect = CGRect(x: 0, y: 0, width: width, height: height)
    webView.takeSnapshot(with: cfg) { image, error in
      defer { self.next() }
      guard let image, let tiff = image.tiffRepresentation,
            let rep = NSBitmapImageRep(data: tiff),
            let png = rep.representation(using: .png, properties: [:]) else {
        fputs("snap fail \(String(describing: error))\n", stderr)
        return
      }
      let path = (outDir as NSString).appendingPathComponent(self.current!.file)
      do {
        try png.write(to: URL(fileURLWithPath: path))
        print("saved \(self.current!.file)")
      } catch {
        fputs("write fail \(error)\n", stderr)
      }
    }
  }
}

let app = NSApplication.shared
app.setActivationPolicy(.accessory)
let cap = Capturer()
DispatchQueue.main.async { cap.start() }
app.run()
