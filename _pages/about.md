---
layout: about
title: about
permalink: /
subtitle: ""
personal_home: true

selected_papers: false
social: false

announcements:
  enabled: false

latest_posts:
  enabled: false
  scrollable: false
  limit: 2
---

<style data-personal-style>
  .happy-rainbow { white-space: normal; }
  .happy-rainbow span:nth-child(5n + 1) { color: #d73651; }
  .happy-rainbow span:nth-child(5n + 2) { color: #bd6500; }
  .happy-rainbow span:nth-child(5n + 3) { color: #25813b; }
  .happy-rainbow span:nth-child(5n + 4) { color: #2778cb; }
  .happy-rainbow span:nth-child(5n + 5) { color: #9b49c5; }
  .about-download { display: flex; justify-content: flex-start; flex-wrap: nowrap; gap: .4rem; align-items: center; margin: 0 auto 0 0; position: relative; flex-shrink: 0; }
  #navbar .about-download + .navbar-toggler { margin-left: auto; }
  #navbar .about-download ~ .navbar-collapse { flex-grow: 1; }
  .about-download button { font-size: .78rem; line-height: 1.4; min-height: 2rem; border: 1px solid var(--global-divider-color); border-radius: .3rem; padding: .2rem .45rem; background: transparent; color: var(--global-text-color-light); cursor: pointer; }
  .about-download button:hover { color: var(--global-theme-color); border-color: var(--global-theme-color); }
  .about-download button:disabled { opacity: .5; cursor: wait; }
  .about-download-status { position: absolute; top: 100%; left: 0; font-size: .75rem; white-space: nowrap; background: var(--global-bg-color); }
  @property --portrait-start {
    syntax: "<color>";
    inherits: true;
    initial-value: #a5a9b5;
  }
  @property --portrait-end {
    syntax: "<color>";
    inherits: true;
    initial-value: #c5c5ce;
  }
  .post-header .post-title .font-weight-bold {
    font-weight: inherit;
  }

  .post-header.profile-header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    padding-right: clamp(0rem, calc(12vw - 4.8rem), 4rem);
    justify-content: start;
    grid-template-rows: auto;
    column-gap: clamp(1rem, 3vw, 2rem);
    row-gap: 1rem;
    align-items: center;
    margin-bottom: 2rem;
  }

  .profile-header .post-title {
    grid-column: 1;
    margin-bottom: 0.25rem;
  }

  .profile-header .desc:empty {
    display: none;
  }

  .profile-header .profile {
    position: relative;
    grid-column: 2;
    grid-row: 1;
    float: none !important;
    width: clamp(10rem, 36vw, 15rem);
    margin: 0 !important;
    box-sizing: content-box;
    padding: 0.7rem;
    border: 1px solid var(--portrait-accent, #c5c5d0);
    border-radius: 0.85rem;
    background: var(--global-bg-color);
    box-shadow: 0 3px 16px #00000008;
    transition: border-color 650ms cubic-bezier(.22,1,.36,1), box-shadow 650ms ease, outline-color 650ms ease;
  }

  .profile-header .profile figure {
    margin: 0;
  }

  .portrait-frame {
    position: relative;
    height: clamp(7rem, 22.2vw, 9.25rem);
    overflow: hidden;
    border-radius: 0.35rem;
    background: transparent;
  }

  .portrait-frame > figure { height: 100%; }
  .portrait-frame picture { display: block; height: 100%; }
  .portrait-frame picture img { width: 100%; height: 100%; object-fit: contain; box-shadow: none; }
  .portrait-frame .pixel-portrait {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    image-rendering: pixelated;
  }
  .portrait-frame .pixel-portrait[hidden] { display: none; }
  .portrait-expand {
    display: inline-flex; align-items: center; justify-content: center;
    position: absolute; top: 0.3rem; right: 0.3rem; z-index: 5;
    width: 2rem; height: 2rem; border: 0; border-radius: 0.4rem;
    color: var(--global-text-color-light); background: var(--global-bg-color);
    cursor: pointer;
  }
  .portrait-expand:hover { color: var(--global-theme-color); }
  .portrait-expand:focus-visible { outline: 2px solid var(--global-theme-color); }
  .portrait-preview {
    max-width: 94vw; max-height: 94vh; padding: 2.5rem 1rem 1rem;
    border: 1px solid #8886; border-radius: 0.8rem;
    background: var(--global-bg-color); color: var(--global-text-color);
    box-shadow: 0 20px 80px #0005;
  }
  .portrait-preview::backdrop { background: #000a; }
  .portrait-preview img { display: block; width: auto; height: auto; max-width: 86vw; max-height: 78vh; object-fit: contain; margin: auto; }
  .portrait-preview-close { position: absolute; right: 0.65rem; top: 0.5rem; border: 0; background: transparent; color: inherit; cursor: pointer; padding: 0.35rem 0.6rem; }
  .portrait-rail { display: flex; height: 100%; width: 100%; transform: translateX(calc((100% - var(--portrait-panel-size, 60%)) / 2 - var(--portrait-index, 0) * var(--portrait-panel-size, 60%))); transition: transform 520ms cubic-bezier(.22,1,.36,1); }
  .portrait-panel { flex: 0 0 var(--portrait-panel-size, 60%); min-width: 0; height: 100%; padding: 6px; box-sizing: border-box; transition: transform 420ms ease, opacity 300ms ease; }
  .portrait-panel[aria-hidden="true"] { opacity: 0; }
  .portrait-panel .is-pixelated { image-rendering: pixelated; }
  .portrait-panel img { display: block; width: 100%; height: 100%; object-fit: contain; border-radius: 0.3rem; box-shadow: none; }
  .portrait-frame.is-dragging .portrait-rail { transition: none; }
  .portrait-frame.is-dragging .portrait-panel img { filter: drop-shadow(0 5px 4px #00000022); }
  .portrait-slider.is-dragging .portrait-knob, .portrait-slider.is-dragging .portrait-fill { transition: none; }
  @media (prefers-reduced-motion: reduce) { .portrait-rail, .portrait-panel { transition: none; } }
  .portrait-control { margin-top: 0.45rem; text-align: center; }
  .portrait-slider { position: relative; padding: 0.2rem 0; }
  .portrait-stops {
    position: absolute; inset: 0 0.8rem;
    display: flex; justify-content: space-between; align-items: center;
    pointer-events: none;
  }
  .portrait-stop { width: 4px; height: 4px; border-radius: 50%; background: #b5b5ba; }
  .portrait-toggle { position: relative; z-index: 1; }
  .portrait-stops { z-index: 2; }
  .portrait-slider:hover .portrait-stop { transform: scale(1.35); }
  .portrait-stop { transition: transform 150ms ease; }
  .portrait-caption {
    display: block;
    min-height: 1.4em;
    font-size: 0.78rem;
    line-height: 1.3;
    color: var(--global-text-color-light);
  }
  .portrait-toggle {
    appearance: none;
    -webkit-appearance: none;
    display: block;
    width: 100%;
    height: 1.4rem;
    margin: 0.6rem 0;
    padding: 0;
    border: 1px solid #d9d9dc;
    background: #e9e9eb;
    cursor: pointer;
    border-radius: 2rem;
  }
  .portrait-toggle::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: 1.65rem;
    height: 1.65rem;
    border-radius: 50%;
    background: #fff;
    border: 1px solid #dedde6;
    box-shadow: 0 1px 3px #00000015;
    transition: transform 150ms ease, box-shadow 150ms ease;
  }
  .portrait-toggle:hover::-webkit-slider-thumb { transform: scale(1.1); box-shadow: 0 2px 6px #00000020; }
  .portrait-toggle:active::-webkit-slider-thumb { transform: scale(1.15); }
  .portrait-toggle::-moz-range-thumb {
    width: 1.65rem; height: 1.65rem;
    border-radius: 50%; background: #fff;
    border: 1px solid #dedde6;
    box-shadow: 0 1px 3px #00000015;
  }
  .portrait-toggle { background: linear-gradient(to right, transparent var(--progress, 0%), #e9e9eb var(--progress, 0%)), linear-gradient(110deg, #9097ff, #b35eff 55%, #7043e5); }
  .portrait-stop.is-selected { visibility: hidden; }
  .portrait-slider {
    --position: 0%;
    --accent: #aaaab2;
    --glow: #aaaab233;
    --fill: linear-gradient(110deg, #a5a9b5, #c5c5ce);
    border-radius: 2rem;
    transition: box-shadow 650ms ease, --portrait-start 650ms ease-in-out, --portrait-end 650ms ease-in-out;
  }
  .portrait-slider:hover { box-shadow: none; }
  .portrait-slider:focus-within { box-shadow: none; }
  .profile-header .profile:has(.portrait-toggle:focus-visible) { outline: 2px solid var(--portrait-accent, #aaaab2); outline-offset: 3px; }
  .portrait-toggle:focus-visible { outline: none; }
  .portrait-track {
    position: absolute; left: 0; right: 0; top: 0.8rem; height: 1.4rem;
    overflow: hidden; border-radius: 2rem; background: #e9e9eb;
    border: 1px solid var(--accent);
    transition: border-color 650ms ease-in-out;
    pointer-events: none;
  }
  .portrait-fill {
    height: 100%; width: var(--position); background: linear-gradient(110deg, var(--portrait-start), var(--portrait-end));
    transition: width 360ms cubic-bezier(.22,1,.36,1), background 300ms ease;
  }
  .portrait-knob {
    position: absolute; top: 0.675rem;
    left: calc(0.825rem + (100% - 1.65rem) * var(--fraction, 0));
    width: 1.65rem; height: 1.65rem;
    transform: translateX(-50%);
    border-radius: 50%; border: 1px solid #dedde6; background: #fff;
    box-shadow: 0 1px 3px #00000018; z-index: 3; pointer-events: none;
    transition: left 360ms cubic-bezier(.22,1,.36,1), scale 150ms ease, box-shadow 150ms ease;
  }
  .portrait-slider:hover .portrait-knob { scale: 1.08; box-shadow: 0 2px 7px #00000025; }
  .portrait-slider.is-dragging .portrait-knob { scale: 1.12; }
  .portrait-toggle { opacity: 0; z-index: 4; }
  @media (prefers-reduced-motion: reduce) {
    .portrait-toggle::-webkit-slider-thumb, .portrait-stop { transition: none; }
    .portrait-slider, .portrait-track, .portrait-fill, .portrait-knob { transition: none; }
  }

  .profile-header .intro-links {
    grid-column: 1;
    margin: 0;
    flex-wrap: nowrap;
  }

  @media (max-width: 480px) {
    .post-header.profile-header { column-gap: 1rem; }
    .profile-header .profile { width: clamp(6.5rem, 28vw, 8.5rem); padding: 0.55rem; }
    .profile-header .post-title { font-size: 1.85rem; }
  }

  .intro-links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin: 0.75rem 0 1.5rem;
  }

  .intro-links a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    color: var(--global-text-color);
    font-size: 1.5rem;
    border-radius: 0.35rem;
    text-decoration: none;
  }

  .intro-links a:hover {
    color: var(--global-theme-color);
  }

  .intro-links .contact-brand-icon {
    display: block;
    width: 1em;
    height: 1em;
  }


  .intro-links a:focus-visible {
    outline: 2px solid var(--global-theme-color);
    outline-offset: 2px;
  }

  @media (max-width: 480px) {
    .profile-header .profile { --portrait-panel-size: 90%; }
    .portrait-frame { height: 6.25rem; }
    .experience-entry .experience-entry-header { flex-direction: column; align-items: flex-start; }
  }

  @media (max-width: 540px) {
    .profile-header .intro-links { flex-wrap: nowrap; gap: .2rem; }
    .profile-header .intro-links a { width: clamp(1.65rem, 8.5vw, 2.25rem); flex-shrink: 1; min-width: 0; font-size: clamp(1.15rem, 5vw, 1.5rem); }
    .about-export-copy .post-header.profile-header {
      grid-template-columns: minmax(0, 1fr);
      padding-right: 0;
      row-gap: 1.25rem;
    }
    .about-export-copy .profile-header .profile { grid-column: 1; grid-row: 2; justify-self: center; }
  }

  .personal-motto {
    margin: 1.25rem 0 2rem;
    font-family: "Snell Roundhand", "Segoe Script", "Apple Chancery", "URW Chancery L", cursive;
    font-size: clamp(1.65rem, 4vw, 2.25rem);
    font-weight: 400;
    line-height: 1.5;
    color: var(--global-text-color);
  }

  .personal-motto a {
    color: inherit;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
  }

  .profile-header .personal-motto {
    grid-column: 1;
    margin: 0;
    align-self: start;
    display: grid;
    gap: 0.65rem;
    font-size: clamp(1.4rem, 3.6vw, 1.85rem);
  }

  .profile-header .personal-motto > p {
    margin: 0;
    padding: 0.35rem 0 0.35rem 0.85rem;
    border-left: 2px solid var(--global-theme-color);
  }
  .profile-intro { grid-column: 1; grid-row: 1; display: flex; flex-direction: column; gap: 1rem; min-width: 0; }
  .profile-intro .personal-motto a { text-decoration: none; }
  .profile-intro .personal-motto a:hover { text-decoration: underline; text-decoration-thickness: 1px; }

  .personal-motto a:hover {
    color: var(--global-theme-color);
  }

  .post { --ongoing-duration-color: var(--global-theme-color); }

  .contact-note {
    --contact-muted: #626c67;
    --contact-border: #e1e7e3;
    --contact-bg: #f7f9f7;
    --contact-happy: #813238;
    --contact-lucky: #69410d;
    --contact-pleased: #2d543a;
    --contact-grateful: #2c4d67;
    --contact-humbled: #614269;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 1rem;
    margin: 0 0 1.4rem;
    padding: 1rem 1.15rem;
    border: 1px solid var(--contact-border);
    border-radius: .85rem;
    background: var(--contact-bg);
    color: var(--global-text-color);
  }
  .contact-note-title { margin: 0 0 .3rem; font-family: Georgia, "Times New Roman", serif; font-size: 1.15rem; font-weight: 400; letter-spacing: -.025em; line-height: 1.35; }
  .contact-word-happy { color: var(--contact-happy); }
  .contact-word-lucky { color: var(--contact-lucky); }
  .contact-word-pleased { color: var(--contact-pleased); }
  .contact-word-grateful { color: var(--contact-grateful); }
  .contact-word-humbled { color: var(--contact-humbled); }
  .contact-amp { color: var(--contact-muted); font-size: .85em; font-style: italic; }
  .contact-note-ending { white-space: nowrap; }
  .contact-note-aside { margin: 0; color: var(--contact-muted); font-size: .8rem; line-height: 1.65; }
  .contact-note-nowrap { white-space: nowrap; }
  .contact-note-actions { display: flex; flex-wrap: wrap; gap: .45rem; }
  .contact-note-actions a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: .4rem;
    min-height: 2.25rem;
    padding: .35rem .7rem;
    border: 1px solid var(--contact-border);
    border-radius: .45rem;
    background: var(--global-bg-color);
    color: inherit;
    font-size: .78rem;
    font-weight: 500;
    line-height: 1.2;
    text-decoration: none;
    transition: border-color 150ms ease, background-color 150ms ease;
  }
  .contact-note-actions a:hover { border-color: var(--contact-muted); background: var(--contact-bg); text-decoration: none; }
  .contact-note-actions a:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
  .contact-note-actions i { font-size: .8rem; }
  html[data-theme="dark"] .contact-note {
    --contact-muted: #b1bbb5;
    --contact-border: #3b4540;
    --contact-bg: #272d29;
    --contact-happy: #f1b2a2;
    --contact-lucky: #ebcd90;
    --contact-pleased: #b9d7b4;
    --contact-grateful: #b4d3df;
    --contact-humbled: #d3bce0;
  }
  @media (max-width: 540px) {
    .contact-note { grid-template-columns: minmax(0, 1fr); gap: .75rem; padding: .9rem 1rem; }
    .contact-note-title { font-size: 1.1rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .contact-note-actions a { transition: none; }
  }

  .home-section {
    --card-border: #e1e5e3;
    --card-rule: #edf0ee;
    --card-inset: #f8f9f8;
    --card-muted: #626c67;
    --card-accent: #53685e;
    --card-track: #e4e9e6;
    --card-fill: #87998f;
    --global-theme-color: var(--card-accent);
    margin-bottom: 1.25rem;
    padding: .65rem clamp(1rem, 2.5vw, 1.5rem) 1.25rem;
    border: 1px solid var(--card-border);
    border-radius: .9rem;
    background: var(--global-bg-color);
    box-shadow: 0 3px 16px #20352a05;
  }
  html[data-theme="dark"] .home-section {
    --card-border: #3b4140;
    --card-rule: #343a38;
    --card-inset: #292e2c;
    --card-muted: #b1bbb5;
    --card-accent: #b2c4b9;
    --card-track: #414b45;
    --card-fill: #9cafa2;
    box-shadow: none;
  }
  .home-section:not([open]) { padding-bottom: .65rem; }

  .home-section > summary {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: .7rem;
    min-height: 2.75rem;
    padding: 0.2rem 0;
    list-style: none;
    cursor: pointer;
  }

  .home-section > summary::-webkit-details-marker { display: none; }
  .home-section > summary h2 { margin: 0; flex-shrink: 0; color: inherit; font-size: 1.2rem; font-weight: 500; letter-spacing: -.015em; }
  .home-section > summary:hover { color: var(--global-theme-color); }
  .home-section > summary:focus-visible {
    outline: 2px solid var(--global-theme-color);
    outline-offset: 4px;
    border-radius: 0.2rem;
  }
  .home-section > summary::after {
    content: "";
    width: 0.45rem;
    height: 0.45rem;
    margin-right: 0.3rem;
    margin-left: auto;
    flex-shrink: 0;
    border-right: 1.5px solid var(--card-muted);
    border-bottom: 1.5px solid var(--card-muted);
    transform: rotate(-45deg);
  }
  .home-section[open] > summary {
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--card-rule);
  }
  .home-section[open] > summary::after { transform: rotate(45deg); }
  .about-export-copy .home-section > summary::after { display: none; }

  .mbti-history[open] > summary { margin-bottom: .25rem; }
  .section-aside { min-width: 0; color: var(--card-muted); font-size: .8rem; font-style: italic; line-height: 1.4; }
  .section-emoji { display: inline-block; margin-left: .2rem; font-style: normal; }
  .mbti-form { margin: 0; }
  .mbti-playground {
    min-width: 0;
    margin: 0;
    padding: 0;
    border: 0;
  }
  .mbti-choice {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    border: 0;
    overflow: hidden;
    clip-path: inset(50%);
  }
  .mbti-date-tab {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.75rem;
    margin: 0 .8rem .6rem 0;
    padding: .35rem .1rem;
    border-bottom: 2px solid transparent;
    color: var(--card-muted);
    font-size: .8rem;
    cursor: pointer;
  }
  .mbti-date-tab:hover { color: var(--global-text-color); }
  .mbti-choice:checked + .mbti-date-tab {
    border-bottom-color: var(--card-fill);
    color: var(--global-text-color);
    font-weight: 500;
  }
  .mbti-choice:focus-visible + .mbti-date-tab {
    outline: 2px solid var(--global-theme-color);
    outline-offset: 3px;
  }
  .mbti-panel { display: none; grid-template-columns: minmax(8rem, 1fr) minmax(0, 2fr); gap: 1.5rem; align-items: center; }
  {% for snapshot in site.data.mbti %}
  #mbti-{{ snapshot.year }}:checked ~ .mbti-panels .mbti-panel-{{ snapshot.year }}{% unless forloop.last %},{% endunless %}
  {% endfor %} { display: grid; }
  .mbti-label { margin: 0 0 .4rem; color: var(--card-muted); font-size: .7rem; letter-spacing: .04em; text-transform: uppercase; }
  .mbti-type { margin: 0 0 .3rem; font-size: 1.65rem; font-weight: 500; letter-spacing: -.035em; line-height: 1.2; }
  .mbti-type a { color: var(--global-text-color); text-decoration: none; }
  .mbti-type a:hover { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: .15em; }
  .mbti-type a::after { content: "↗"; display: inline-block; margin-left: .35rem; color: var(--card-muted); font-size: .8rem; vertical-align: top; }
  .mbti-date { color: var(--card-muted); font-size: .8rem; font-variant-numeric: tabular-nums; }
  .mbti-traits { display: grid; gap: .45rem; margin: 0; padding: 0; list-style: none; }
  .mbti-traits li { display: grid; grid-template-columns: minmax(8.75rem, 1fr) minmax(2rem, 1fr); align-items: center; gap: 1rem; }
  .mbti-trait-label { display: flex; justify-content: space-between; gap: .65rem; font-size: .8rem; line-height: 1.4; }
  .mbti-trait-label > span { color: var(--card-muted); }
  .mbti-trait-label strong { font-weight: 500; font-variant-numeric: tabular-nums; }
  .mbti-track { height: 3px; overflow: hidden; border-radius: 1rem; background: var(--card-track); }
  .mbti-track span { display: block; height: 100%; border-radius: inherit; background: var(--card-fill); }
  .about-export-copy .mbti-choice, .about-export-copy .mbti-date-tab { display: none; }
  .about-export-copy .mbti-panels { display: grid; gap: 1.5rem; }
  .about-export-copy .mbti-panel { display: grid; }
  .about-export-copy .mbti-panel + .mbti-panel { border-top: 1px solid var(--card-rule); padding-top: 1.5rem; }
  @media (max-width: 540px) {
    .mbti-panel { grid-template-columns: minmax(0, 1fr); gap: .85rem; }
    .mbti-identity { display: flex; align-items: baseline; justify-content: space-between; gap: .5rem; flex-wrap: wrap; }
    .mbti-label { display: none; }
    .mbti-type { margin-bottom: 0; font-size: 1.5rem; }
    .mbti-traits li { grid-template-columns: minmax(8.75rem, 1fr) minmax(2rem, 1.2fr); gap: .75rem; }
  }

  #ma2026yuvionllm > .author,
  #qiu2026yuvion > .author {
    display: none;
  }

  .paper-role {
    margin: 0.25rem 0;
    color: var(--global-text-color-light);
    font-size: 0.9rem;
  }

  .experience-entry {
    padding: .2rem 0;
  }
  .experience-entry + .experience-entry {
    margin-top: 1.25rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--card-rule);
  }

  .experience-entry-header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.25rem 1rem;
  }

  .experience-entry h3 {
    margin: 0;
    font-size: 1rem;
    font-weight: 500;
  }

  .experience-entry .experience-meta {
    color: var(--card-muted);
    font-size: 0.85rem;
    line-height: 1.65;
  }

  .experience-entry p {
    margin: 0.4rem 0 0;
    font-size: .95rem;
    line-height: 1.65;
  }

  .experience-photo {
    max-width: 32rem;
    margin: 1rem auto 0;
    text-align: center;
  }

  .experience-photo a {
    display: inline-block;
    max-width: 100%;
    border-radius: 0.6rem;
  }

  .experience-photo a:focus-visible {
    outline: 2px solid var(--global-theme-color);
    outline-offset: 3px;
  }

  .experience-photo img {
    display: block;
    margin: 0 auto;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 20rem;
    border-radius: 0.6rem;
  }

  .experience-days, .experience-duration-estimate {
    font-variant-numeric: tabular-nums;
  }
  .experience-days.is-ongoing {
    color: var(--ongoing-duration-color);
    font-weight: 500;
  }

  .chinese-name {
    font-size: 0.55em;
    font-weight: 400;
    white-space: nowrap;
  }

  .name-pronunciation {
    margin-left: 0.2rem;
    padding: 0.1rem 0.2rem;
    border: 0;
    color: var(--global-text-color);
    font-size: 0.42em;
    line-height: 1;
    vertical-align: 0.2em;
    background: transparent;
    cursor: pointer;
  }

  .name-pronunciation:hover {
    color: var(--global-theme-color);
  }

  .name-pronunciation:focus-visible {
    border-radius: 0.2rem;
    outline: 2px solid var(--global-theme-color);
    outline-offset: 2px;
  }

  .paper-group,
  .individual-papers > ol.bibliography > li {
    margin: 1rem 0 0;
    padding: clamp(.85rem, 2.5vw, 1.25rem);
    border: 1px solid var(--card-border);
    border-radius: .65rem;
    background: var(--card-inset);
  }

  .individual-papers > ol.bibliography {
    padding-left: 0;
    list-style: none;
  }

  .paper-group h3 {
    margin-bottom: 0.35rem;
    font-size: 1.35rem;
  }

  .paper-group-statement {
    max-width: 48rem;
    padding: 0 0 .85rem;
    border-bottom: 1px solid var(--card-border);
    color: var(--card-muted);
    font-family: Georgia, "Times New Roman", serif;
    font-size: 0.9rem;
    font-style: italic;
    line-height: 1.65;
  }

  .paper-group-statement p:last-child {
    margin-bottom: 0;
  }

  .paper-group .publications {
    margin-top: 1rem;
  }
  .home-section .publications ol.bibliography { margin: 0; }
  .home-section .paper-group .publications ol.bibliography > li { margin: 0; padding: 0; }
  .home-section .publications .row { margin: 0; }
  .home-section .publications .row > .col-sm-10 { flex: 0 0 100%; max-width: 100%; padding: 0; }
  .home-section .publications ol.bibliography li .title { font-size: .95rem; font-weight: 500; line-height: 1.5; }
  .home-section .publications .author, .home-section .publications .periodical { font-size: .85rem; line-height: 1.65; }
  .home-section .publications .links { margin-top: .5rem; }
  .home-section .publications ol.bibliography li .links .btn { border-color: var(--card-border); border-radius: .3rem; background: var(--global-bg-color); }
  .home-section .publications ol.bibliography li .links .btn:hover { border-color: var(--card-accent); color: var(--card-accent); }
  .paper-group .bibliography + .bibliography { margin-top: 1rem !important; padding-top: 1rem; border-top: 1px solid var(--card-rule); }
</style>

<div class="about-download" data-html2canvas-ignore>
  <span class="about-download-status" role="status" aria-live="polite"></span>
  <button type="button" data-about-export="pdf" aria-label="Download full page as PDF">↓ PDF</button>
  <button type="button" data-about-export="png" aria-label="Download full page as PNG">↓ PNG</button>
</div>
<script defer src="{{ '/assets/about-export.js' | relative_url }}" data-export-assets="{{ '/assets/vendor/' | relative_url }}"></script>

<audio id="name-pronunciation-audio" preload="none">
  <source src="{{ '/assets/audio/yujian-li.m4a' | relative_url }}" type="audio/mp4">
</audio>

<script defer src="{{ '/assets/about-portrait.js' | relative_url }}"></script>

<div class="profile-intro" data-profile-intro>
  <h1 class="post-title">{{ site.first_name }} {{ site.last_name }} <span class="chinese-name" lang="zh-CN">(李宇健)</span><button class="name-pronunciation" type="button" title="Play pronunciation: Lǐ Yǔjiàn" aria-label="Play pronunciation of 李宇健"><i class="fa-solid fa-volume-high" aria-hidden="true"></i></button></h1>
</div>

{% assign default_portrait = site.data.portraits | first %}

<div class="profile" data-portrait-card>
  <div class="portrait-frame">
    <div class="portrait-rail">
      {% for portrait in site.data.portraits %}
      <div class="portrait-panel" data-label="{{ portrait.label | escape }}" data-original="{{ portrait.image | relative_url }}" aria-hidden="{% if forloop.first %}false{% else %}true{% endif %}">
        {% assign display_image = portrait.preview | default: portrait.image | relative_url %}
        <img {% if forloop.first %}src="{{ display_image }}" fetchpriority="high"{% else %}data-src="{{ display_image }}"{% endif %} alt="Yujian Li — {{ portrait.label | escape }}" width="{{ portrait.width }}" height="{{ portrait.height }}" decoding="async"{% if portrait.pixelated %} class="is-pixelated"{% endif %}>
      </div>
      {% endfor %}
    </div>
  </div>
  <div class="portrait-control">
    <span class="portrait-caption" aria-live="polite">{{ default_portrait.label }}</span>
    <div class="portrait-slider"{% if site.data.portraits.size < 2 %} hidden{% endif %}>
      <div class="portrait-track" aria-hidden="true"><div class="portrait-fill"></div></div>
      <input type="range" min="0" max="{{ site.data.portraits.size | minus: 1 }}" step="0.001" value="0" class="portrait-toggle" aria-label="Portrait version" aria-valuetext="{{ default_portrait.label | escape }}">
      <div class="portrait-stops" aria-hidden="true">
        {% for portrait in site.data.portraits %}<span class="portrait-stop{% if forloop.first %} is-selected{% endif %}"></span>{% endfor %}
      </div>
      <div class="portrait-knob" aria-hidden="true"></div>
    </div>
  </div>
  <a class="portrait-expand" href="{{ default_portrait.image | relative_url }}" target="_blank" rel="noopener noreferrer" aria-label="Open current portrait image" title="Open full image"><i class="fa-solid fa-expand" aria-hidden="true"></i></a>
</div>

<nav class="intro-links" aria-label="Contact and profiles">
  <a class="homepage-link" href="https://liyujian.cn" target="_blank" rel="noopener noreferrer" aria-label="Personal homepage" title="Personal homepage"><i class="fa-solid fa-house" aria-hidden="true"></i></a>
  <a href="mailto:{{ site.data.socials.email }}" aria-label="Email" title="Email"><i class="fa-solid fa-envelope" aria-hidden="true"></i></a>
  <a href="https://x.com/{{ site.data.socials.x_username }}" target="_blank" rel="noopener noreferrer" aria-label="X" title="X"><i class="fa-brands fa-x-twitter" aria-hidden="true"></i></a>
  <a href="https://github.com/{{ site.data.socials.github_username }}" target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub"><i class="fa-brands fa-github" aria-hidden="true"></i></a>
  <a href="{{ site.data.socials.chatgpt_url | escape }}" target="_blank" rel="noopener noreferrer" aria-label="ChatGPT profile" title="ChatGPT"><i class="fa-brands fa-openai" aria-hidden="true"></i></a>
  <!-- Monochrome Calendly mark, preserving the official geometry: https://calendly.com/media/favicon/icon.svg -->
  <a href="https://calendly.com/bebetterest/open-on-anything" target="_blank" rel="noopener noreferrer" aria-label="Calendly — Schedule a chat" title="Calendly — Schedule a chat"><svg class="contact-brand-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="3 3 26 26" fill="currentColor" aria-hidden="true" focusable="false"><path d="M16.0001 28.5779C7.69694 28.5779 3.42236 25.488 3.42236 16.0004C3.42236 6.51285 7.69614 3.42236 16.0001 3.42236C24.3041 3.42236 28.5779 6.51187 28.5779 16.0004C28.5779 25.4889 24.3037 28.5779 16.0001 28.5779ZM22.8505 9.18627C18.4643 4.79925 11.8407 4.31045 8.05747 8.09356C4.27392 11.8771 4.76316 18.5005 9.14974 22.8866C13.5364 27.2737 20.1593 27.762 23.9425 23.9788C27.726 20.1953 27.2371 13.5723 22.8506 9.18619L22.8505 9.18627ZM16.0001 20.3382C17.7685 20.3382 19.2715 19.1249 19.8168 17.4368C19.865 17.2862 20.0042 17.184 20.162 17.184H22.0489C22.2106 17.184 22.3353 17.3251 22.3169 17.4859C21.9008 21.1848 19.7653 22.4363 16.0001 22.4363C11.7797 22.4363 9.60761 20.8641 9.60761 16.0361C9.60761 11.2082 11.7793 9.63632 16.0001 9.63632C19.7656 9.63632 21.9008 10.8875 22.3169 14.5868C22.3353 14.7475 22.2105 14.8888 22.0489 14.8888H20.162C20.0041 14.8888 19.865 14.7865 19.8168 14.6359C19.2715 12.9478 17.7689 11.7345 16.0001 11.7345C13.7715 11.7345 11.9649 13.6601 11.9649 16.0361C11.9649 18.412 13.7715 20.338 16.0001 20.338V20.3382Z"></path></svg></a>
  <a href="{{ '/feed.xml' | relative_url }}" aria-label="RSS" title="RSS"><i class="fa-solid fa-square-rss" aria-hidden="true"></i></a>
</nav>

<div class="personal-motto">
  <p><a href="https://en.wikipedia.org/wiki/We_Are_All_Trying_Here" target="_blank" rel="noopener noreferrer">we are all trying here</a></p>
  <p><a href="https://plato.stanford.edu/entries/ayn-rand/" target="_blank" rel="noopener noreferrer">do not let your fire go out, spark by irreplaceable spark</a></p>
</div>

<aside class="contact-note" aria-label="Say hello">
  <div class="contact-note-copy">
    <p class="contact-note-title"><span class="contact-word-happy">Happy</span> <span class="contact-amp">&amp;</span> <span class="contact-word-lucky">lucky</span> <span class="contact-amp">&amp;</span> <span class="contact-word-pleased">pleased</span> <span class="contact-amp">&amp;</span> <span class="contact-word-grateful">grateful</span> <span class="contact-amp">&amp;</span> <span class="contact-word-humbled">humbled</span> <span class="contact-note-ending">to connect.</span></p>
    <p class="contact-note-aside">Fewer people, more words. <span class="contact-note-nowrap">Especially online. <span aria-hidden="true">🤖</span></span></p>
  </div>
  <div class="contact-note-actions">
    <a href="mailto:{{ site.data.socials.email }}"><i class="fa-regular fa-envelope" aria-hidden="true"></i>Email me</a>
    <a href="https://calendly.com/bebetterest/open-on-anything" target="_blank" rel="noopener noreferrer" aria-label="Book a chat on Calendly">Calendly</a>
  </div>
</aside>

<details class="home-section mbti-history">
  <summary><h2 id="mbti-heading">MBTI</h2><span class="section-aside">shape-shifting <span class="section-emoji" aria-hidden="true">🫠</span></span></summary>
  <form class="mbti-form">
  <fieldset class="mbti-playground">
    <legend class="sr-only">Choose a personality snapshot</legend>
    {% for snapshot in site.data.mbti %}
    <input class="mbti-choice" type="radio" name="mbti-snapshot" id="mbti-{{ snapshot.year }}"{% if forloop.first %} checked{% endif %}>
    <label class="mbti-date-tab" for="mbti-{{ snapshot.year }}">{{ snapshot.year }}{% if forloop.first %} · latest{% endif %}</label>
    {% endfor %}
    <div class="mbti-panels">
      {% for snapshot in site.data.mbti %}
      <section class="mbti-panel mbti-panel-{{ snapshot.year }}" aria-labelledby="mbti-type-{{ snapshot.year }}">
        <div class="mbti-identity">
          <p class="mbti-label">{{ snapshot.label }}</p>
          <h3 class="mbti-type" id="mbti-type-{{ snapshot.year }}"><a href="{{ snapshot.url }}" target="_blank" rel="noopener noreferrer" aria-label="Open {{ snapshot.year }} {{ snapshot.type }} result">{{ snapshot.type }}</a></h3>
          <time class="mbti-date" datetime="{{ snapshot.date }}">{{ snapshot.date | date: '%Y.%m.%d' }}</time>
        </div>
        <ul class="mbti-traits">
          {% for trait in snapshot.traits %}
          <li>
            <div class="mbti-trait-label"><span>{{ trait.name }}</span><strong>{{ trait.value }}%</strong></div>
            <div class="mbti-track" aria-hidden="true"><span style="width: {{ trait.value }}%"></span></div>
          </li>
          {% endfor %}
        </ul>
      </section>
      {% endfor %}
    </div>
  </fieldset>
  </form>
</details>

<details class="home-section">
  <summary><h2>experience</h2><span class="section-aside">priceless treasures <span class="section-emoji" aria-hidden="true">💎</span></span></summary>
<section aria-label="Research experience">
  {% for job in site.data.cv.cv.sections.Experience %}
  <div class="experience-entry">
    <div class="experience-entry-header">
      <h3>{{ job.company }}</h3>
      <span class="experience-meta"><time datetime="{{ job.start_date }}">{{ job.start_date | date: '%b %-d, %Y' }}</time> – {% if job.end_date == 'Present' %}Present{% else %}<time datetime="{{ job.end_date }}">{{ job.end_date | date: '%b %-d, %Y' }}</time>{% endif %}<span class="experience-days" data-start-date="{{ job.start_date }}" data-end-date="{{ job.end_date }}"></span></span>
    </div>
    <div class="experience-meta">{{ job.position }}</div>
    {% if job.highlights and job.highlights.size > 0 %}
      {% assign highlight = job.highlights | first | escape %}
      {% assign greeting = 'Happy to meet c, wang, tensor, peixin, ziv... (Doomed without you all 💣).' %}
      {% assign escaped_greeting = greeting | escape %}
      {% capture rainbow_greeting %}<span class="happy-rainbow">{%- assign characters = greeting | split: '' -%}{%- for character in characters -%}<span>{{ character | escape }}</span>{%- endfor -%}</span>{% endcapture %}
      <p>{{ highlight | replace: escaped_greeting, rainbow_greeting }}</p>
    {% endif %}
    {% if job.photo %}
    <figure class="experience-photo">
      <a href="{{ job.photo.image | relative_url }}" target="_blank" rel="noopener noreferrer" aria-label="Open full-size {{ job.company | escape }} internship group photo">
        <img src="{{ job.photo.image | relative_url }}" alt="{{ job.photo.alt | escape }}" width="{{ job.photo.width }}" height="{{ job.photo.height }}" loading="lazy" decoding="async">
      </a>
    </figure>
    {% endif %}
  </div>
  {% endfor %}
</section>
</details>

<details class="home-section">
  <summary><h2>education</h2></summary>
<section aria-label="Education">
  {% for degree in site.data.cv.cv.sections.Education %}
  <div class="experience-entry">
    <div class="experience-entry-header">
      <h3>{{ degree.institution }}</h3>
      {% if degree.date_precision == 'year' %}
      <span class="experience-meta"><time datetime="{{ degree.start_date }}">{{ degree.start_date }}</time> – <time datetime="{{ degree.end_date }}">{{ degree.end_date }}</time>{% if degree.approximate_duration %}<span class="experience-duration-estimate"> ({{ degree.approximate_duration }})</span>{% endif %}</span>
      {% else %}
      <span class="experience-meta"><time datetime="{{ degree.start_date }}">{{ degree.start_date | date: '%b %-d, %Y' }}</time> – {% if degree.end_date == 'Present' %}Present{% else %}<time datetime="{{ degree.end_date }}">{{ degree.end_date | date: '%b %-d, %Y' }}</time>{% endif %}<span class="experience-days" data-start-date="{{ degree.start_date }}" data-end-date="{{ degree.end_date }}"></span></span>
      {% endif %}
    </div>
    {% if degree.description %}<p>{{ degree.description }}</p>{% else %}<p>{{ degree.studyType }} in {{ degree.area }}</p>{% endif %}
  </div>
  {% endfor %}
</section>
</details>

<details class="home-section">
  <summary><h2>papers</h2><span class="section-aside">recycle bin <span class="section-emoji" aria-hidden="true">🗑️</span></span></summary>
<p class="small text-muted"><sup>*</sup> Corresponding author · <sup>†</sup> Equal contribution</p>

{% capture rendered_papers %}
{% assign boxed_keys = '' | split: ',' %}
{% assign bottom_boxes = '' %}
{% for box in site.data.paper_boxes %}
{% capture box_content %}

<section class="paper-group" aria-label="Related papers">
  {% if box.before != empty %}
  <div class="paper-group-statement">{{ box.before | markdownify }}</div>
  {% endif %}
  <div class="publications">
    {% for paper_key in box.papers %}
      {% assign boxed_keys = boxed_keys | push: paper_key %}
      {% capture paper_content %}{% bibliography --group_by none --query @*[key={{paper_key}}]* %}{% endcapture %}
      {% if paper_key == 'ma2026yuvionllm' %}
        {{ paper_content | replace: '<div class="author">', '<div class="paper-role">Contributor</div><div class="author">' }}
      {% elsif paper_key == 'qiu2026yuvion' %}
        {{ paper_content | replace: '<div class="author">', '<div class="paper-role">Core Contributor</div><div class="author">' }}
      {% elsif paper_key == 'li2023spell' %}
        {{ paper_content | replace: 'based on a LLM</div>', 'based on <s>a</s> LLM</div>' }}
      {% else %}
        {{ paper_content }}
      {% endif %}
    {% endfor %}
  </div>
  {% if box.after != empty %}
  <div class="paper-group-statement">{{ box.after | markdownify }}</div>
  {% endif %}
</section>
{% endcapture %}
{% if box.position == 'bottom' %}
  {% assign bottom_boxes = bottom_boxes | append: box_content %}
{% else %}
  {{ box_content }}
{% endif %}
{% endfor %}

{% capture unboxed_query %}@{{ '*' }}[selected=true{% for paper_key in boxed_keys %} && key!={{paper_key}}{% endfor %}]{{ '*' }}{% endcapture %}

<div class="publications individual-papers">
  {% bibliography --group_by none --query {{unboxed_query}} %}
</div>

{{ bottom_boxes }}
{% endcapture %}

{% comment %}Keep official copyable citations separate from display names and author-role markers.{% endcomment %}
{% for citation in site.data.official_bibtex %}
{% capture entry_marker %}<div id="{{ citation[0] }}"{% endcapture %}
{% unless rendered_papers contains entry_marker %}{% continue %}{% endunless %}
{% assign entry_content = rendered_papers | split: entry_marker | last %}
{% comment %}Locate the first Bib block after this entry, not the final entry's block.{% endcomment %}
{% assign bib_parts = entry_content | split: '<div class="bibtex hidden">' %}
{% assign generated_bib = bib_parts[1] | split: '</div>' | first %}
{% capture official_bib %}<pre><code class="language-bibtex">{{ citation[1].bibtex | escape }}</code></pre>{% endcapture %}
{% if generated_bib and generated_bib != empty %}
{% assign rendered_papers = rendered_papers | replace: generated_bib, official_bib %}
{% endif %}
{% endfor %}
{{ rendered_papers }}

</details>

{% if site.posts.size > 0 %}

  <h2><a href="{{ '/blog/' | relative_url }}" style="color: inherit">latest posts</a></h2>

{% include latest_posts.liquid %}

{% endif %}

<script>
  (() => {
    // Calendar days in Shanghai; the starting date counts as day one.
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Shanghai", year: "numeric", month: "2-digit", day: "2-digit"
    });
    function calendarDate(value) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value || "")) return NaN;
      const [year, month, day] = value.split("-").map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));
      return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date.getTime() : NaN;
    }
    const durationEntries = Array.from(document.querySelectorAll(".experience-days"), (label) => ({
      label,
      start: calendarDate(label.dataset.startDate),
      ongoing: !label.dataset.endDate || label.dataset.endDate.toLowerCase() === "present",
      end: calendarDate(label.dataset.endDate)
    }));
    const activeEntries = durationEntries.filter((entry) => entry.ongoing && Number.isFinite(entry.start));
    activeEntries.forEach(({ label }) => label.classList.add("is-ongoing"));
    function updateExperienceDays(entries) {
      const now = new Date();
      const parts = Object.fromEntries(formatter.formatToParts(now).map(({ type, value }) => [type, value]));
      const today = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day));
      entries.forEach(({ label, start, ongoing, end: fixedEnd }) => {
        const end = ongoing ? today : fixedEnd;
        const days = Math.floor((end - start) / 86400000) + 1;
        if (ongoing && Number.isFinite(start)) {
          // Date-only starts mean midnight in Beijing (UTC+08:00).
          const seconds = Math.floor((now.getTime() - (start - 8 * 3600000)) / 1000);
          if (seconds < 0) { label.textContent = ""; return; }
          const elapsedDays = Math.floor(seconds / 86400);
          const hours = String(Math.floor(seconds % 86400 / 3600)).padStart(2, "0");
          const minutes = String(Math.floor(seconds % 3600 / 60)).padStart(2, "0");
          const remainder = String(seconds % 60).padStart(2, "0");
          label.textContent = ` (${elapsedDays}d ${hours}h ${minutes}m ${remainder}s)`;
          label.title = "Elapsed time since midnight Beijing time on the starting date.";
        } else {
          label.textContent = Number.isFinite(days) && days > 0 && start <= today ? ` (${days} ${days === 1 ? "day" : "days"})` : "";
          label.title = "Calendar days, including both the starting and ending dates.";
        }
      });
    }
    updateExperienceDays(durationEntries);
    let timer;
    function scheduleNextSecond() {
      // Re-align every tick so scheduling delays do not accumulate.
      timer = setTimeout(() => {
        timer = undefined;
        if (document.hidden) return;
        updateExperienceDays(activeEntries);
        scheduleNextSecond();
      }, 1000 - (Date.now() % 1000));
    }
    function syncTimer() {
      clearTimeout(timer);
      timer = undefined;
      if (!document.hidden && activeEntries.length) {
        updateExperienceDays(activeEntries);
        scheduleNextSecond();
      }
    }
    document.addEventListener("visibilitychange", syncTimer);
    window.addEventListener("pagehide", () => clearTimeout(timer));
    window.addEventListener("pageshow", syncTimer);
    syncTimer();
  })();
</script>
