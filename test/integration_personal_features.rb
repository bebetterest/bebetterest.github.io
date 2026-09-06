# Contract checks for the site's opt-in layer, without modifying installed gems.
require "jekyll"
require_relative "../_plugins/personal_site"

SiteFixture = Struct.new(:source, :baseurl)
PageFixture = Struct.new(:site, :data, :output, :output_ext)
site = SiteFixture.new(File.expand_path("..", __dir__), "/preview")
markup = <<~HTML
  <!doctype html><html><head>
  <script id="MathJax-script" src="https://example.test/mathjax.js"></script>
  <script src="/assets/al_math/js/mathjax-setup.js"></script>
  <link rel="stylesheet" href="https://example.test/academicons.css">
  <link rel="stylesheet" href="https://example.test/scholar-icons.css">
  </head><body><p>Feature fixture</p></body></html>
HTML

def check(condition, message)
  abort "FAIL: #{message}" unless condition
end

[
  [{}, false, 0],
  [{ "math" => false }, false, 0],
  [{ "math" => true, "icon_sets" => ["academicons"] }, true, 1],
  [{ "pseudocode" => true, "icon_sets" => ["academicons", "scholar-icons"] }, true, 2]
].each do |data, math, icons|
  page = PageFixture.new(site, data, markup, ".html")
  PersonalSite.transform(page)
  doc = Nokogiri::HTML(page.output)
  check(!!doc.at_css("#MathJax-script") == math, "math opt-in mismatch")
  check(!!doc.at_css('script[src*="mathjax-setup"]') == math, "math setup opt-in mismatch")
  check(doc.css('link[href*="academicons"], link[href*="scholar-icons"]').size == icons, "icon opt-in mismatch")
  check(doc.at_css('link[href*="personal-site.css"]')["href"].start_with?("/preview/assets/"), "asset baseurl mismatch")
end
feed = PageFixture.new(site, {}, "<feed/>", ".xml")
PersonalSite.transform(feed)
check(feed.output == "<feed/>", "non-HTML output must remain untouched")
puts "PASS: page opt-ins, baseurl-aware assets and non-HTML boundaries."
