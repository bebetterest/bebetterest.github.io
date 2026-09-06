# Run after Jekyll builds: bundle exec ruby test/integration_personal_site.rb [destination]
require "json"
require "nokogiri"
require "uri"
require "yaml"

root = File.expand_path(ARGV.fetch(0, "_site"))
def check(condition, message)
  abort "FAIL: #{message}" unless condition
end

html_paths = Dir.glob("#{root}/**/*.html").reject { |p| p.start_with?("#{root}/assets/") }
check(html_paths.map { |p| p.delete_prefix("#{root}/") }.sort == %w[404.html blog/index.html index.html], "unexpected content pages")
non_assets = Dir.glob("#{root}/**/*", File::FNM_DOTMATCH).select { |p| File.file?(p) && !p.start_with?("#{root}/assets/") }
allowed = %w[index.html blog/index.html 404.html feed.xml sitemap.xml robots.txt CNAME .nojekyll]
check(non_assets.all? { |p| allowed.include?(p.delete_prefix("#{root}/")) }, "unexpected non-asset published file")

home = Nokogiri::HTML(File.read("#{root}/index.html"))
rss = home.at_css('a[aria-label="RSS"]')
check(!rss.nil?, "RSS link missing")
base = rss["href"].delete_suffix("feed.xml")
check(base.start_with?("/"), "RSS path must be site-relative")
html_paths.each do |file|
  doc = Nokogiri::HTML(File.read(file))
  doc.css("[src],[data-src],[data-original],a[href],link[href]").each do |node|
    link = node["src"] || node["data-src"] || node["data-original"] || node["href"]
    next unless link&.start_with?(base) && !link.start_with?("//")
    relative = URI::DEFAULT_PARSER.unescape(link.delete_prefix(base).split(/[?#]/).first.to_s)
    target = File.expand_path(relative, root)
    check(target == root || target.start_with?("#{root}/"), "local link escapes site")
    check(File.file?(target) || File.file?(File.join(target, "index.html")), "missing local target: #{relative}")
  end
end

JSON.parse(File.read("_data/official_bibtex.json")).each do |key, source|
  code = home.at_css("##{key} .bibtex code")
  check(code && code.text == source.fetch("bibtex"), "official citation mismatch: #{key}")
end
check(home.css(".publications a").none? { |a| a.text.strip == "DOI" }, "DOI button reappeared")

check(home.css(".post > header.profile-header [data-portrait-card]").size == 1, "portrait must be in the initial header")
check(home.css(".post > header.profile-header .profile-intro .intro-links").size == 1, "intro must be in the initial header")
check(home.css("#navbar > .container > .about-download").size == 1, "downloads must be in the initial navigation")
check(home.at_css("head style[data-personal-style]"), "homepage styles must precede body rendering")
portraits = home.css(".portrait-panel img")
portrait_count = YAML.safe_load_file("_data/portraits.yml").size
check(portraits.size == portrait_count && portraits.count { |img| img["src"] } == 1, "only the default portrait should load initially")
check(portraits.drop(1).all? { |img| img["data-src"] && !img["srcset"] }, "secondary portraits must load on interaction")
check(home.at_css(".portrait-expand")["href"].end_with?("/prof_pic_pixel.png"), "initial original-image link mismatch")
check(home.at_css('.portrait-panel[data-label="GPT Image"]')["data-original"].end_with?("/prof_pic_gpt_image.png"), "original image must remain accessible")
check(File.size("#{root}/assets/img/prof_pic_gpt_image-preview.jpg") < 100_000, "display image is unexpectedly large")
home.css("div.bibtex.hidden").each do |panel|
  check(panel.has_attribute?("hidden") && panel.has_attribute?("inert") && panel["aria-hidden"] == "true", "collapsed Bib is not hidden from focus/AT")
  button = home.at_css("button[aria-controls='#{panel['id']}']")
  check(button && button["aria-expanded"] == "false" && button["type"] == "button", "Bib needs a native disclosure button")
end
html_paths.each do |file|
  doc = Nokogiri::HTML(File.read(file))
  check(doc.css('script#MathJax-script, script[src*="medium-zoom"], script[src*="/al_math/js/mathjax-setup.js"], script[src*="/al_img_tools/js/zoom.js"]').empty?, "unused math/zoom asset on #{file}")
  check(doc.css('link[href*="academicons"], link[href*="scholar-icons"]').empty?, "unused icon set on #{file}")
  expected = "https://liyujian.cn#{base}#{file.delete_prefix("#{root}/").sub(/index\.html$/, "")}"
  check(doc.at_css('link[rel="canonical"]')&.[]("href") == expected, "canonical domain mismatch on #{file}")
  check(doc.at_css('meta[property="og:url"]')&.[]("content") == expected, "Open Graph domain mismatch on #{file}")
end
blog = Nokogiri::HTML(File.read("#{root}/blog/index.html"))
check(blog.at_css(".blog-empty")&.text&.strip == "No posts yet. Notes will appear here.", "blog empty state missing")

sitemap = Nokogiri::XML(File.read("#{root}/sitemap.xml")) { |c| c.strict }
locations = sitemap.xpath('//*[local-name()="loc"]').map(&:text)
check(locations.size == 2, "sitemap must contain only about and blog")
origin = locations.find { |url| URI(url).path == base }
check(origin == "https://liyujian.cn#{base}" && locations.include?("#{origin}blog/"), "sitemap site URL mismatch")
feed = Nokogiri::XML(File.read("#{root}/feed.xml")) { |c| c.strict }
check(feed.at_xpath('//*[local-name()="feed"]/*[local-name()="title"]').text == "Yujian Li", "feed title mismatch")
self_link = feed.at_xpath('//*[local-name()="link"][@rel="self"]')
check(self_link && self_link["href"] == "#{origin}feed.xml", "feed canonical URL mismatch")
puts "PASS: publish boundaries, links, official Bib text, initial layout, lazy portraits, Bib accessibility, optional assets, blog empty state and canonical URLs."
