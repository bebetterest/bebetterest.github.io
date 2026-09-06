# Site-only composition on top of the pinned al-folio gems.
# Build the final DOM before serving it; never rearrange the header on page load.
require "nokogiri"
require "digest"

module PersonalSite
  def self.asset(site, path)
    digest = Digest::SHA256.file(File.join(site.source, path)).hexdigest[0, 12]
    "#{site.baseurl}/#{path}?v=#{digest}"
  end

  def self.required(doc, selector)
    doc.at_css(selector) || raise("Personal site markup changed: missing #{selector}")
  end

  def self.transform(page)
    return unless page.output_ext == ".html"

    doc = Nokogiri::HTML(page.output)
    head = required(doc, "head")
    style = Nokogiri::XML::Node.new("link", doc)
    style["rel"] = "stylesheet"
    style["href"] = asset(page.site, "assets/personal-site.css")
    head.add_child(style)

    if page.data["personal_home"]
      header = required(doc, ".post > .post-header")
      intro = required(doc, "[data-profile-intro]")
      intro.add_child(required(doc, ".intro-links"))
      intro.add_child(required(doc, ".personal-motto"))
      card = required(doc, "[data-portrait-card]")
      header.children.remove
      header.add_class("profile-header")
      header.add_child(intro)
      header.add_child(card)
      nav = required(doc, "#navbar > .container")
      nav.prepend_child(required(doc, ".about-download"))
      head.add_child(required(doc, "style[data-personal-style]"))
    end

    # The math gem has a site-wide switch; this site additionally opts in per page.
    unless page.data["math"] || page.data["pseudocode"]
      doc.css('script#MathJax-script, script[src*="/al_math/js/mathjax-setup.js"]').remove
    end
    # Font Awesome is used by the navigation. Additional sets are page opt-ins.
    { "academicons" => "academicons", "scholar-icons" => "scholar-icons" }.each do |name, path|
      next if Array(page.data["icon_sets"]).include?(name)

      doc.css("link[rel='stylesheet']").select { |link| link["href"].to_s.include?(path) }.each(&:remove)
    end

    panels = doc.css("div.bibtex.hidden")
    panels.each_with_index do |panel, index|
      entry = panel.parent
      trigger = required(entry, ".links a.bibtex")
      panel["id"] = "#{entry['id'] || "publication-#{index}"}-bibtex"
      panel["hidden"] = ""
      panel["inert"] = ""
      panel["aria-hidden"] = "true"
      trigger.name = "button"
      trigger.remove_attribute("role")
      trigger.remove_attribute("href")
      trigger["type"] = "button"
      trigger["data-bib-toggle"] = ""
      trigger["aria-expanded"] = "false"
      trigger["aria-controls"] = panel["id"]
    end
    unless panels.empty?
      script = Nokogiri::XML::Node.new("script", doc)
      script["defer"] = ""
      script["src"] = asset(page.site, "assets/personal-site.js")
      required(doc, "body").add_child(script)
    end
    page.output = doc.to_html
  end
end

Jekyll::Hooks.register [:pages, :documents], :post_render, priority: :low do |page|
  PersonalSite.transform(page)
end
