"use strict";
/* ================= Shared page markup (the same on every page) ================= */
const SHELL = `

<aside class="switcher" aria-label="Prototype state switcher">
  <h2>Test state</h2>
  <p>Shows the routes list in this state and sets what the next search returns.</p>
  <fieldset id="stateSwitch">
    <legend>Routes list state</legend>
    <label><input type="radio" name="state" value="cold" autocomplete="off" checked> Cold start</label>
    <label><input type="radio" name="state" value="high" autocomplete="off"> High confidence</label>
    <label><input type="radio" name="state" value="low" autocomplete="off"> Low confidence</label>
    <label><input type="radio" name="state" value="no_result" autocomplete="off"> No result</label>
    <label><input type="radio" name="state" value="error" autocomplete="off"> Error</label>
    <label><input type="radio" name="state" value="waiting" autocomplete="off"> Waiting</label>
  </fieldset>
  <div class="load-error" id="loadError" hidden>The route data could not be loaded. Open this page through a web server (for example <code>python3 -m http.server</code>), not as a file.</div>
</aside>

<div class="phone" id="phone">
  <div class="statusbar" id="statusbar" aria-hidden="true">
    <span>9:41</span>
    <span class="sb-icons">
      <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg>
      <svg width="17" height="12" viewBox="0 0 17 12"><path d="M8.5 2.3c2.4 0 4.6.9 6.2 2.5l1.2-1.2C13.9 1.6 11.3.5 8.5.5S3.1 1.6 1.1 3.6l1.2 1.2C3.9 3.2 6.1 2.3 8.5 2.3zm0 3.4c1.5 0 2.8.6 3.8 1.5l1.2-1.2c-1.3-1.3-3.1-2-5-2s-3.7.7-5 2l1.2 1.2c1-.9 2.3-1.5 3.8-1.5zm0 3.4c-.6 0-1.2.2-1.6.7L8.5 12l1.6-2.2c-.4-.5-1-.7-1.6-.7z"/></svg>
      <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="20" height="9" rx="2"/><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" opacity=".5"/></svg>
    </span>
  </div>

  <!-- ===== Routes list ===== -->
  <section class="screen" id="routes" tabindex="-1" aria-label="Routes">
    <div class="map" id="routesMap"></div>
    <div class="topbar">
      <div class="searchbar glass" id="searchbar"></div>
      <button class="plan-btn" data-action="noop"><svg class="i" viewBox="0 0 24 24"><use href="#ic-plus"/></svg>Plan</button>
    </div>
    <div class="chips">
      <button class="chip glass" data-action="noop"><svg class="i hike" viewBox="0 0 24 24"><use href="#ic-hiker"/></svg>Hike<svg class="i" viewBox="0 0 24 24" style="width:16px;height:16px"><use href="#ic-chevdown"/></svg></button>
      <button class="chip glass" data-action="noop"><svg class="i" viewBox="0 0 24 24"><use href="#ic-radius"/></svg>within 30 km</button>
      <button class="chip glass" data-action="noop"><svg class="i" viewBox="0 0 24 24"><use href="#ic-filter"/></svg>Filters</button>
    </div>
    <div class="mapbtns">
      <button class="mapbtn glass icon-btn" data-action="noop" aria-label="Offline"><svg class="i" viewBox="0 0 24 24"><use href="#ic-wifioff"/></svg></button>
      <button class="mapbtn glass icon-btn" data-action="noop" aria-label="My location"><svg class="i" viewBox="0 0 24 24"><use href="#ic-locate"/></svg></button>
      <button class="mapbtn glass icon-btn" data-action="noop" aria-label="Map layers"><svg class="i" viewBox="0 0 24 24"><use href="#ic-layers"/></svg></button>
    </div>
    <div class="mapcover" id="mapCover"></div>
    <div class="sheet" id="routesSheetWrap">
      <div class="scroll" id="routesSheet"></div>
    </div>
    <button class="mappill" id="mapPill" data-action="map-pill"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-map"/></svg>Map</button>
    <div class="tabslot"></div>
  </section>

  <!-- ===== Route detail ===== -->
  <section class="screen" id="detail" tabindex="-1" aria-label="Route detail">
    <div class="scroll" id="detailScroll">
      <div class="hero">
        <div class="carousel" data-slot="carousel"></div>
        <button class="roundbtn glass icon-btn tl" data-action="back" aria-label="Back"><svg class="i" viewBox="0 0 24 24"><use href="#ic-back"/></svg></button>
        <div class="tr glass"><button class="icon-btn" data-action="noop" aria-label="Share"><svg class="i" viewBox="0 0 24 24"><use href="#ic-share"/></svg></button><button class="icon-btn" data-action="noop" aria-label="More options"><svg class="i" viewBox="0 0 24 24"><use href="#ic-more"/></svg></button></div>
        <div class="photocount" data-slot="photocount"></div>
        <div class="dots" data-slot="dots"></div>
        <div class="minimap" id="detailMini" aria-hidden="true"></div>
      </div>
      <div class="detail-body" id="detailBody"></div>
    </div>
    <div class="actions">
      <button class="btn-main" data-action="save">Save<svg class="i" viewBox="0 0 24 24"><use href="#ic-bookmark"/></svg></button>
      <button class="btn-sq icon-btn" data-action="navigate" aria-label="Navigate"><svg class="i" viewBox="0 0 24 24"><use href="#ic-nav"/></svg></button>
      <button class="btn-sq icon-btn" data-action="noop" aria-label="Edit route"><svg class="i" viewBox="0 0 24 24"><use href="#ic-pencil"/></svg></button>
    </div>
    <div class="tabslot"></div>
  </section>

  <!-- ===== Saved route ===== -->
  <section class="screen" id="saved" tabindex="-1" aria-label="Saved route">
    <div class="scroll" id="savedScroll">
      <div class="hero">
        <div class="carousel" data-slot="carousel"></div>
        <button class="roundbtn glass icon-btn tl" data-action="back" aria-label="Back"><svg class="i" viewBox="0 0 24 24"><use href="#ic-back"/></svg></button>
        <div class="tr glass"><button class="icon-btn" data-action="noop" aria-label="Share"><svg class="i" viewBox="0 0 24 24"><use href="#ic-share"/></svg></button><button class="icon-btn" data-action="noop" aria-label="More options"><svg class="i" viewBox="0 0 24 24"><use href="#ic-more"/></svg></button></div>
        <div class="photocount" data-slot="photocount"></div>
        <div class="dots" data-slot="dots"></div>
        <div class="minimap" id="savedMini" aria-hidden="true"></div>
      </div>
      <div class="detail-body" id="savedBody"></div>
    </div>
    <div class="actions">
      <button class="btn-main" data-action="navigate">Navigate<svg class="i" viewBox="0 0 24 24"><use href="#ic-nav"/></svg></button>
    </div>
    <div class="tabslot"></div>
  </section>

  <!-- ===== What people say ===== -->
  <section class="screen plain" id="wps" tabindex="-1" aria-label="What people say">
    <div class="scroll"><div class="page" id="wpsBody"></div></div>
    <div class="tabslot"></div>
  </section>

  <!-- ===== Report ===== -->
  <section class="screen plain" id="report" tabindex="-1" aria-label="Report summary">
    <div class="scroll"><div class="page" id="reportBody" style="padding-bottom:190px"></div></div>
    <div class="submitbar"><button class="btn-main" id="submitReport" data-action="submit-report" aria-disabled="true">Submit</button></div>
    <div class="tabslot"></div>
  </section>

  <!-- ===== Report received ===== -->
  <section class="screen" id="received" tabindex="-1" aria-label="Report received">
    <div class="received">
      <svg width="200" height="160" viewBox="0 0 200 160" aria-hidden="true">
        <rect x="0" y="0" width="200" height="160" rx="24" fill="#E4E6C4"/>
        <path d="M0 118 Q50 92 100 112 T200 104 V136 Q200 160 176 160 H24 Q0 160 0 136Z" fill="#B0B889"/>
        <path d="M0 132 Q60 120 120 134 T200 128 V136 Q200 160 176 160 H24 Q0 160 0 136Z" fill="#8FA066"/>
        <path d="M70 150 Q96 128 92 112 Q90 100 104 96" fill="none" stroke="#2B6BEA" stroke-width="4" stroke-linecap="round"/>
        <rect x="58" y="22" width="90" height="62" rx="16" fill="#fff"/>
        <path d="M80 84 L76 100 L96 84Z" fill="#fff"/>
        <circle cx="103" cy="53" r="18" fill="#4F6814"/>
        <path d="M94 53 l6 6 l12 -12" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <use href="#ic-sparkle" x="148" y="20" width="24" height="24" style="color:#FF5F00"/>
      </svg>
      <h1>Report received</h1>
      <p>Thanks for telling us. Your report helps keep route summaries accurate for everyone.</p>
      <button class="btn-main" data-action="back-to-route">Back to route</button>
    </div>
  </section>

  <!-- ===== Navigation started ===== -->
  <section class="screen" id="nav" tabindex="-1" aria-label="Navigation">
    <div class="navbar"><svg class="i" viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-arrowup"/></svg><h1>Follow the map</h1></div>
    <div class="speed">
      <div><b>0,0<small>km/h</small></b><span>Current speed</span></div>
      <div><b>–<small>km/h</small></b><span>Average speed</span></div>
    </div>
    <div class="map" id="navMap"></div>
    <div class="navbtns">
      <button class="btn-controls" data-action="noop">Controls</button>
      <button class="btn-end" data-action="end-nav">End navigation</button>
    </div>
  </section>

  <!-- ===== Search ===== -->
  <section class="screen plain" id="search" tabindex="-1" aria-label="Search">
    <div class="scroll">
      <form class="searchfield" id="searchForm" role="search">
        <button type="button" class="icon-btn" data-action="back" aria-label="Back"><svg class="i" viewBox="0 0 24 24"><use href="#ic-back"/></svg></button>
        <input type="search" id="searchInput" placeholder="Search or describe the route" aria-label="Search or describe the route" enterkeyhint="search" autocomplete="off">
        <button type="button" class="icon-btn" data-action="clear-input" aria-label="Clear search"><svg class="i" viewBox="0 0 24 24"><use href="#ic-clear"/></svg></button>
        <button type="submit" class="icon-btn go" aria-label="Search" hidden><svg class="i" viewBox="0 0 24 24" style="width:19px;height:19px"><use href="#ic-search"/></svg></button>
      </form>
      <div class="quick">
        <div class="quickrow">
          <button class="opt" data-action="noop"><span class="tile" style="background:#D8E1F6;color:#2D5BD3"><svg class="i" viewBox="0 0 24 24" style="fill:currentColor;stroke:none"><use href="#ic-home"/></svg></span><span class="grow"><b>Start from home</b><small>Add your home address</small></span></button>
          <button class="edit icon-btn" data-action="noop" aria-label="Edit home address"><svg class="i" viewBox="0 0 24 24"><use href="#ic-pencil"/></svg></button>
        </div>
        <button class="opt" data-action="noop"><span class="tile" style="background:#E2E5CC;color:#3A4419"><svg class="i" viewBox="0 0 24 24" style="fill:currentColor"><use href="#ic-nav"/></svg></span><b>From current location</b></button>
        <button class="opt" data-action="noop"><span class="tile" style="background:#E2E5CC;color:#3A4419"><svg class="i" viewBox="0 0 24 24"><use href="#ic-radius"/></svg></span><b>Hikes within 10 km</b></button>
      </div>
      <div class="examples">
        <h2>Describe the route you want</h2>
        <p>Tap an example or type your own.</p>
        <button class="ex" data-action="example" data-q="Quiet hike along the water"><span class="thumb-img"><img class="realphoto" src="images/lake-calm-forest.jpg" alt=""></span>Quiet hike along the water</button>
        <button class="ex inert" data-action="noop"><span class="thumb-img"><img class="realphoto" src="images/meadow-path.jpg" alt=""></span>Short loop with a café stop</button>
        <button class="ex inert" data-action="noop"><span class="thumb-img"><img class="realphoto" src="images/forest-path-pine.jpg" alt=""></span>Forest walk under 2 hours</button>
        <button class="ex inert" data-action="noop"><span class="thumb-img"><img class="realphoto" src="images/lake-forest-view.jpg" alt=""></span>Easy walk with views of the city</button>
      </div>
    </div>
  </section>

  <!-- ===== Route saved sheet ===== -->
  <div class="overlay" id="saveOverlay">
    <div class="dim"></div>
    <div class="savesheet" role="dialog" aria-modal="true" aria-labelledby="savedTitle">
      <div class="grabber"></div>
      <div class="head"><h2 id="savedTitle" tabindex="-1">Route saved!</h2>
        <button class="x icon-btn" data-action="close-sheet" aria-label="Close"><svg class="i" viewBox="0 0 24 24"><use href="#ic-close"/></svg></button></div>
      <p class="lead">Rename, share or turn it into a group event!</p>
      <label class="lbl" for="nameField">Rename your adventure</label>
      <input class="namefield" id="nameField" type="text">
      <div class="toggle-row"><span id="offlineLbl">Save offline</span><button class="switch" role="switch" aria-checked="false" aria-labelledby="offlineLbl" data-action="noop"></button></div>
      <div class="eventcard">
        <div class="row">
          <svg width="74" height="62" viewBox="0 0 74 62" aria-hidden="true" style="flex:none"><defs><clipPath id="evclip1"><rect x="5" y="9" width="38" height="28" rx="4"/></clipPath></defs>
            <g transform="rotate(-6 24 22)"><rect x="2" y="6" width="44" height="34" rx="6" fill="#fff"/><rect x="5" y="9" width="38" height="28" rx="4" fill="#9CC0DA"/><path d="M5 28 Q16 20 26 26 T43 24 V33 Q43 37 39 37 H9 Q5 37 5 33Z" fill="#6E8A3E"/><image href="images/meadow-path.jpg" x="5" y="9" width="38" height="28" preserveAspectRatio="xMidYMid slice" clip-path="url(#evclip1)"/></g>
            <g transform="rotate(5 50 40)"><rect x="26" y="22" width="44" height="36" rx="6" fill="#fff"/><rect x="29" y="25" width="38" height="30" rx="4" fill="#E4E6C4"/><path d="M29 44 Q40 38 48 46 T67 42" stroke="#B0B889" stroke-width="6" fill="none"/></g>
            <path d="M48 26c-5 0-8 3.6-8 7.8 0 5.6 8 13.2 8 13.2s8-7.6 8-13.2C56 29.6 53 26 48 26z" fill="#FF5F00"/><circle cx="48" cy="34" r="3" fill="#fff"/>
          </svg>
          <div><b>Turn it into a public event</b><span>Choose a date and meeting spot. Everyone can join!</span></div>
        </div>
        <button class="btn-dark" data-action="noop">Get started</button>
      </div>
      <button class="btn-main done" data-action="close-sheet">Done</button>
    </div>
  </div>
</div>

<!-- ===== Icon sprite ===== -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <symbol id="ic-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20.5 20.5 16 16"/></symbol>
    <symbol id="ic-clear" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/></symbol>
    <symbol id="ic-plus" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></symbol>
    <symbol id="ic-hiker" viewBox="0 0 24 24"><circle cx="13.5" cy="4" r="1.9" fill="currentColor" stroke="none"/><path d="M11 21l2-6 3 3v3M12.5 15l1-6 3 3.5h3M13.5 9l-4 2-1.5 4M18.5 12v9"/></symbol>
    <symbol id="ic-chevdown" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5"/></symbol>
    <symbol id="ic-chevright" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></symbol>
    <symbol id="ic-radius" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M5.2 8.5a8 8 0 0 0 0 7M18.8 8.5a8 8 0 0 1 0 7M8.5 4.8a8 8 0 0 1 7 0M8.5 19.2a8 8 0 0 0 7 0"/></symbol>
    <symbol id="ic-filter" viewBox="0 0 24 24"><path d="M4 5h16l-6 7.5V18l-4 2v-7.5z"/></symbol>
    <symbol id="ic-wifioff" viewBox="0 0 24 24"><path d="M2.5 9a14 14 0 0 1 19 0M5.8 12.5a9.5 9.5 0 0 1 12.4 0M9.2 16a4.5 4.5 0 0 1 5.6 0"/><circle cx="12" cy="19.5" r="1" fill="currentColor"/><path d="M4 4l16 16"/></symbol>
    <symbol id="ic-locate" viewBox="0 0 24 24"><path d="M20 4 3.5 10.8l7.2 2.5 2.5 7.2z"/></symbol>
    <symbol id="ic-nav" viewBox="0 0 24 24"><path d="M20.5 3.5 3.5 10.5l7.5 2.5 2.5 7.5z"/></symbol>
    <symbol id="ic-layers" viewBox="0 0 24 24"><path d="M12 4l9 4.5-9 4.5-9-4.5z"/><path d="M3 12.5l9 4.5 9-4.5"/><path d="M3 16.5l9 4.5 9-4.5"/></symbol>
    <symbol id="ic-home" viewBox="0 0 24 24"><path d="M3.5 11 12 3.5l8.5 7.5V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z"/></symbol>
    <symbol id="ic-homeline" viewBox="0 0 24 24"><path d="M4 11l8-7 8 7v9h-5.5v-6h-5v6H4z"/></symbol>
    <symbol id="ic-routes" viewBox="0 0 24 24"><circle cx="7" cy="4.5" r="2" fill="currentColor"/><circle cx="17" cy="19.5" r="2" fill="currentColor"/><path d="M8.5 5.5c5 1 6 5-.5 6.5s-1 6.5 6.5 7"/></symbol>
    <symbol id="ic-record" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.5"/></symbol>
    <symbol id="ic-profile" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.4-4 4.4-6 8-6s6.6 2 8 6"/></symbol>
    <symbol id="ic-back" viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></symbol>
    <symbol id="ic-share" viewBox="0 0 24 24"><path d="M12 15V3.5M8 7.5l4-4 4 4M7 11H5.5v9.5h13V11H17"/></symbol>
    <symbol id="ic-more" viewBox="0 0 24 24"><circle cx="6" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="18" cy="12" r="1.6" fill="currentColor"/></symbol>
    <symbol id="ic-image" viewBox="0 0 24 24"><rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="M4 17l5-4.5 3.5 3 3-2.5 4.5 4"/></symbol>
    <symbol id="ic-star" viewBox="0 0 24 24"><path fill="currentColor" d="M10.8 2.2L8.4 7.95l-6.21.5a1.2 1.2 0 0 0-.74 2.28l4.73 4.06-1.44 6.06a1.2 1.2 0 0 0 1.94 1.41L12 19.02l5.32 3.24a1.2 1.2 0 0 0 1.94-1.41l-1.44-6.06 4.73-4.06a1.2 1.2 0 0 0-.74-2.28l-6.21-.5-2.4-5.75a1.3 1.3 0 0 0-2.4 0Z"/></symbol>
    <symbol id="ic-people" viewBox="0 0 24 24"><circle cx="8.2" cy="7.4" r="4.4" fill="currentColor"/><path fill="currentColor" d="M1.2 19.6C1.2 15.6 4.3 13.4 8.2 13.4s7 2.2 7 6.2V21H1.2Z"/><path d="M16.4 3.4c1.9.9 3.1 2.7 3.1 4.7 0 1.9-1 3.5-2.6 4.4M19.4 15.1c2 1 3.2 2.7 3.4 4.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></symbol>
    <symbol id="ic-clock" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M10 2.5h4"/></symbol>
    <symbol id="ic-dist" viewBox="0 0 24 24"><path d="M3.5 12h17M7 8.5 3.5 12 7 15.5M17 8.5l3.5 3.5-3.5 3.5"/></symbol>
    <symbol id="ic-up" viewBox="0 0 24 24"><path d="M6 18 18 6M9 6h9v9"/></symbol>
    <symbol id="ic-loop" viewBox="0 0 24 24"><path d="M4.5 12A7.5 7.5 0 0 1 17.8 7.2M19.5 12A7.5 7.5 0 0 1 6.2 16.8"/><path d="M18.5 3v4.5H14M5.5 21v-4.5H10"/></symbol>
    <symbol id="ic-bookmark" viewBox="0 0 24 24"><path d="M6.5 3.5h11v17l-5.5-4-5.5 4z"/></symbol>
    <symbol id="ic-pencil" viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></symbol>
    <symbol id="ic-thumbup" viewBox="0 0 24 24"><path d="M7 11v9.5H3.5V11z"/><path d="M7 11l4-7.5c1.6 0 2.7 1.2 2.4 2.8L12.8 10h5.6a2 2 0 0 1 2 2.4l-1.3 6.4a2 2 0 0 1-2 1.7H7"/></symbol>
    <symbol id="ic-close" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></symbol>
    <symbol id="ic-arrowup" viewBox="0 0 24 24"><path d="M12 21V4M5 11l7-7 7 7"/></symbol>
    <symbol id="ic-sparkle" viewBox="0 0 15 15"><path fill="currentColor" d="M5.22 3.62L4.96 4.56 4.62 5.37 4.19 6.07 3.68 6.68 3.07 7.19 2.37 7.62 1.56 7.96.62 8.22.34 8.35.13 8.56.01 8.85 0 9 .06 9.3.22 9.56.34 9.65.62 9.78 1.56 10.04 2.37 10.38 3.07 10.81 3.68 11.32 4.19 11.93 4.62 12.63 4.96 13.44 5.22 14.38 5.35 14.66 5.44 14.78 5.7 14.94 6 15 6.3 14.94 6.56 14.78 6.65 14.66 6.78 14.38 7.04 13.44 7.38 12.63 7.81 11.93 8.32 11.32 8.93 10.81 9.63 10.38 10.44 10.04 11.38 9.78 11.66 9.65 11.78 9.56 11.94 9.3 12 9 11.99 8.85 11.87 8.56 11.66 8.35 11.38 8.22 10.44 7.96 9.63 7.62 8.93 7.19 8.32 6.68 7.81 6.07 7.38 5.37 7.04 4.56 6.73 3.47 6.56 3.22 6.44 3.13 6.15 3.01 5.85 3.01 5.7 3.06 5.56 3.13 5.35 3.34Z"/><path fill="currentColor" d="M11.21 1.15L11.04 1.66 10.9 1.99 10.73 2.28 10.52 2.52 10.28 2.73 9.99 2.9 9.15 3.21 9.03 3.37 9 3.5 9.03 3.63 9.15 3.79 9.99 4.1 10.28 4.27 10.52 4.48 10.73 4.72 10.9 5.01 11.21 5.85 11.3 5.94 11.5 6 11.7 5.94 11.79 5.85 12.1 5.01 12.27 4.72 12.48 4.48 12.72 4.27 13.01 4.1 13.85 3.79 13.97 3.63 14 3.5 13.97 3.37 13.85 3.21 13.01 2.9 12.72 2.73 12.4 2.45 12.1 1.99 11.96 1.66 11.83 1.21 11.7 1.06 11.57 1.01 11.37 1.03Z"/></symbol>
    <symbol id="ic-map" viewBox="0 0 24 24"><path d="M3.5 6.5 9 4.5l6 2 5.5-2v13l-5.5 2-6-2-5.5 2z"/><path d="M9 4.5v13M15 6.5v13"/></symbol>
    <symbol id="ic-sun" viewBox="0 0 24 24"><path d="M4 16a8 8 0 0 1 16 0z" fill="#FF5F00"/><path d="M12 4v3M5.5 7l2 2M18.5 7l-2 2M2.5 12.5h2.5M19 12.5h2.5" stroke="#FF5F00" stroke-width="1.8" stroke-linecap="round"/><path d="M2 18.5h20" stroke="#FF5F00" stroke-width="1.8" stroke-linecap="round"/></symbol>
  </defs>
</svg>

`;
document.body.insertAdjacentHTML("afterbegin", SHELL);

/* ================= Constants (layout only — all route content comes from data/*.json) ================= */
const DEFAULT_QUERY = "Quiet hike along the water";
const ACTIVE_ROUTE = "Rummelsburger Bay loop";           // the only route with screens behind it
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";
const ROUTES_CENTER = [13.4890, 52.4930];
const MARKER_POS = {
  "Rummelsburger Bay loop": [13.4880, 52.4960],
  "Treptower Park loop": [13.4690, 52.4880],
  "Spree riverside walk": [13.4700, 52.4950],
  "Rummelsburger See and Plänterwald trails": [13.4870, 52.4810]
};
const MARKER_COLORS = ["#2D5BD3", "#8C7FDB", "#A3372A", "#4A3A2E"];
// Three photos per route, the same everywhere that route appears (card, detail, saved route).
const ROUTE_PHOTOS = {
  "Rummelsburger Bay loop": ["lake-reeds.jpg", "lake-reeds-sunset.jpg", "pond-reeds.jpg"],
  "Treptower Park loop": ["lake-trees-reflection.jpg", "meadow-path.jpg", "forest-path-autumn.jpg"],
  "Spree riverside walk": ["river-trees-reflection.jpg", "lake-calm-forest.jpg", "lake-forest-view.jpg"],
  "Rummelsburger See and Plänterwald trails": ["forest-path-green.jpg", "forest-path-pine.jpg", "forest-light.jpg"]
};
const photo = (file, cls = "realphoto") => `<img class="${cls}" src="images/${file}" alt="" draggable="false">`;
const AVATAR_COLORS = ["#5C6F2B", "#8A5A3C", "#3F6E8C", "#6B5B95", "#9A6B1F"];
const REASONS = [
  ["Doesn’t match what I asked for", "The route isn’t what I described in the search, for example it’s not along the river or not quiet."],
  ["Wrong about this route", "The summary says something the tips or the route data don’t show, or gets a fact about the route wrong."],
  ["Not helpful", "The summary is too vague or general to help me decide whether to take this route."],
  ["Personal information", "The summary shows details about a person, like a name, address or phone number."]
];

/* ================= Pages + state in the URL ================= */
// Each screen is its own page. ?state= picks the scenario (default cold_start); q, view, banner, from, switcher and task carry over.
const PAGE = document.body.dataset.page || "index";
const PAGE_SCREEN = { index: "routes", search: "search", route: "detail", tips: "wps", report: "report", "report-received": "received", saved: "detail", "saved-route": "saved", navigation: "nav" };
const STATE_IN = { cold_start: "cold", high: "high", low: "low", no_result: "no_result", error: "error", waiting: "waiting" };
const STATE_OUT = { cold: "cold_start", high: "high", low: "low", no_result: "no_result", error: "error", waiting: "waiting" };
const P = new URLSearchParams(location.search);
const URLP = {
  state: STATE_IN[P.get("state")] ? P.get("state") : "cold_start",
  q: P.get("q"),
  view: ["cancelled", "nearby"].includes(P.get("view")) ? P.get("view") : null,
  banner: P.get("banner") !== "0",
  from: P.get("from") === "saved" ? "saved" : null,
  run: P.get("run") === "1",
  clear: P.get("clear") === "1",
  switcher: P.get("switcher") === "1",
  task: ["1", "2", "3"].includes(P.get("task")) ? P.get("task") : null
};
// Tag the Clarity session with the task and the state on every page load.
if (typeof window.clarity === "function") {
  if (URLP.task) window.clarity("set", "task", URLP.task);
  window.clarity("set", "state", URLP.state);
}
const FROM_PAGES = ["tips", "report", "report-received"];
function pageURL(page, extra = {}) {
  const u = new URLSearchParams();
  u.set("state", STATE_OUT[S.nextState]);
  if (S.query) u.set("q", S.query);
  if (S.view === "cancelled") u.set("view", "cancelled");
  if (S.view === "cold" && S.nextState !== "cold" && !S.query) u.set("view", "nearby");
  if (!S.bannerOpen) u.set("banner", "0");
  const from = "from" in extra ? extra.from : (FROM_PAGES.includes(page) ? URLP.from : null);
  if (from && FROM_PAGES.includes(page)) u.set("from", from);
  if (extra.clear) u.set("clear", "1");
  if (extra.run) u.set("run", "1");
  if (URLP.switcher) u.set("switcher", "1");
  if (URLP.task) u.set("task", URLP.task);
  return `${page === "index" ? "index" : page}.html?${u.toString()}`;
}
let navigating = false;
// Plays the same in-page screen animation as before, then loads the page for that screen.
function nav(page, extra = {}, anim = null) {
  if (navigating) return;
  navigating = true;
  const url = pageURL(page, extra);
  const target = PAGE_SCREEN[page], cur = document.querySelector(".screen.active");
  if (anim && cur && cur.id !== target) {
    show(target, null, anim);
    if (target === "search" && extra.clear) { $("#searchInput").value = ""; syncGo(); }
  }
  setTimeout(() => location.assign(url), anim ? (reduceMotion() ? 200 : 350) : 0);
}
function syncURL() { if (PAGE === "index") history.replaceState(null, "", pageURL("index")); }
function routeForView(view) {
  const p = S.data[payloadFor(view) || "no_result"];
  return p.routes.find(r => r.title === ACTIVE_ROUTE) || null;
}

/* ================= App state ================= */
const S = {
  data: null,            // payloads keyed by state
  view: "cold",          // what the routes list shows now: cold | high | low | no_result | error | waiting | cancelled
  nextState: "cold",     // switcher choice: what the next search returns
  query: "",
  bannerOpen: true,
  route: null,           // route object opened on detail
  routeIsLow: false,
  thumbsUp: false,
  reason: null,
  timers: [],
  stack: ["routes"]
};

/* ================= Helpers ================= */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmtDec = (n, d) => Number(n).toFixed(d).replace(".", ",");
const fmtThousands = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
const fmtDuration = m => { const h = Math.floor(m / 60), r = m % 60; return h ? `${h}h ${r}m` : `${r}m`; };
const fmtKm = d => `${fmtDec(d, 2)} km`;
const aiLabel = (ai, low) => `AI summary of ${ai.tip_count} ${ai.tip_count === 1 ? "tip" : "tips"}${low ? " · little data" : ""}`;
function aiLabelRow(ai, low) {
  const based = `Based on ${ai.tip_count} ${ai.tip_count === 1 ? "tip" : "tips"}`;
  return `<div class="ailabelrow"><span class="sr-only">AI summary, ${based.toLowerCase()}${low ? ", little data" : ""}</span>` +
    `<span class="aipill" aria-hidden="true">${sparkle()}<span>AI Summary</span></span>` +
    `<span class="aibased" aria-hidden="true">${based}${low ? " · little data" : ""}</span></div>`;
}
const ic = (id, extra = "") => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true" ${extra}><use href="#ic-${id}"/></svg>`;
const sparkle = () => `<svg class="sparkle" viewBox="0 0 15 15" aria-hidden="true"><use href="#ic-sparkle"/></svg>`;
const starIcon = () => `<svg class="star" viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-star"/></svg>`;
const peopleIcon = () => `<svg class="people" viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-people"/></svg>`;

/* ================= Shared components ================= */
function tabbar() {
  const items = [["homeline", "Home"], ["routes", "Routes"], ["record", "Record"], ["profile", "Profile"], ["wifioff", "Offline"]];
  return `<nav class="tabbar glass" aria-label="Main">${items.map(([i, l]) =>
    `<button data-action="noop" ${l === "Routes" ? 'class="sel" aria-current="page"' : ""}>${ic(i)}<span>${l}</span></button>`).join("")}</nav>`;
}
function aiBox(ai, low, opts = {}) {
  return `<div class="aibox${low ? " low" : ""}">
    ${aiLabelRow(ai, low)}
    <div class="signal">${esc(ai.signal)}</div>
    ${opts.seeTips ? `<button class="seetips" data-action="see-tips">See the tips ${ic("chevright")}</button>` : ""}
  </div>`;
}
function statsLine(r) {
  return `<div class="stats">${ic("clock")}<span>${fmtDuration(r.duration_min)}</span><span class="sep">·</span>${ic("dist")}<span>${fmtKm(r.distance_km)}</span><span class="sep">·</span>${ic("up")}<span>${r.elevation_gain_m} m</span></div>`;
}
function ratingLine(r) {
  const score = fmtDec(r.rating, 1), count = fmtThousands(r.rating_count);
  return `<div class="rating"><span class="sr-only">Rating ${score}, ${count} ratings</span><span class="rpair" aria-hidden="true">${starIcon()}<span>${score}</span></span><span class="rpair" aria-hidden="true">${peopleIcon()}<span>${count}</span></span></div>`;
}
function cardAi(ai, low) {
  return `<span class="cardai${low ? " low" : ""}" style="display:block">
    ${aiLabelRow(ai, low)}
    <span class="cardai-signal">${esc(ai.signal)}</span>
  </span>`;
}
function routeCard(r, low, showAi) {
  const active = r.title === ACTIVE_ROUTE;
  const tag = active ? "button" : "div";
  const attrs = active ? `data-action="open-route" aria-label="${esc(r.title)}, open route"` : "";
  return `<${tag} class="card${active ? "" : " inert"}" ${attrs}>
    <span class="photo" style="display:block">
      ${sliderHTML(ROUTE_PHOTOS[r.title] || [], true)}
      ${r.difficulty ? `<span class="chip-easy">${esc(r.difficulty)}</span>` : ""}
      ${dotsHTML((ROUTE_PHOTOS[r.title] || []).length)}
    </span>
    <span class="meta" style="display:block">
      ${ratingLine(r)}
      <div class="title">${esc(r.title)}</div>
      ${statsLine(r)}
      ${showAi && r.ai ? cardAi(r.ai, low) : ""}
    </span>
  </${tag}>`;
}
function skeletonCard() {
  return `<div class="card skel" aria-hidden="true"><div class="photo shimmer"></div>
    <div class="meta"><div class="bar shimmer" style="width:30%"></div><div class="bar shimmer" style="width:60%"></div><div class="bar shimmer" style="width:50%"></div>
    <div class="airow">${sparkle()}<div class="bar shimmer"></div></div></div></div>`;
}

/* ================= Photo slider (cards: auto + by hand; detail: by hand) ================= */
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
function sliderHTML(files, auto) {
  if (!files.length) return "";
  const list = auto ? [...files, files[0]] : files;               // cards: clone of the first photo at the end for a seamless loop
  return `<span class="slider" data-n="${files.length}"><span class="track">${list.map(f => photo(f, "")).join("")}</span></span>`;
}
function dotsHTML(n) { return n > 1 ? `<span class="dots">${Array.from({ length: n }, (_, i) => `<i${i ? "" : ' class="on"'}></i>`).join("")}</span>` : ""; }
function slideTo(s, i, ms) {
  const w = s.el.clientWidth || 1;
  s.i = i;
  s.track.style.transition = ms ? `transform ${ms}ms cubic-bezier(.25,.8,.25,1)` : "none";
  s.track.style.transform = `translateX(${-i * w}px)`;
  if (s.dots) s.dots.querySelectorAll("i").forEach((d, k) => d.classList.toggle("on", k === i % s.n));
  clearTimeout(s.loopT);
  if (i >= s.n) s.loopT = setTimeout(() => slideTo(s, 0, 0), ms + 20);   // landed on the clone: jump back to the real first photo
}
function initSlider(el, dots, auto) {
  if (!el) return null;
  const s = { el, dots, track: el.querySelector(".track"), n: +el.dataset.n, i: 0, manual: false, p: null, swallow: false, visible: false };
  el._s = s;
  el.addEventListener("pointerdown", e => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (s.i >= s.n) slideTo(s, 0, 0);
    s.p = { id: e.pointerId, x: e.clientX, y: e.clientY, axis: null, dx: 0, lastX: e.clientX, lastT: e.timeStamp, v: 0 };
  });
  el.addEventListener("pointermove", e => {
    const p = s.p; if (!p || e.pointerId !== p.id) return;
    const tdx = e.clientX - p.x, tdy = e.clientY - p.y;
    if (!p.axis) {
      if (Math.max(Math.abs(tdx), Math.abs(tdy)) < 6) return;
      p.axis = Math.abs(tdx) > Math.abs(tdy) ? "x" : "y";
      if (p.axis === "y") { s.p = null; return; }                        // vertical: leave it to the sheet / list
      try { el.setPointerCapture(p.id); } catch (_) {}
      s.manual = true;                                                    // swiped by hand: no more auto-play on this card
      el.classList.add("grabbing");
    }
    let dx = tdx;
    if ((s.i === 0 && dx > 0) || (s.i === s.n - 1 && dx < 0)) dx /= 3;    // resist at the ends
    p.dx = dx;
    p.v = (e.clientX - p.lastX) / Math.max(1, e.timeStamp - p.lastT); p.lastX = e.clientX; p.lastT = e.timeStamp;
    const w = el.clientWidth;
    s.track.style.transition = "none";
    s.track.style.transform = `translateX(${-s.i * w + dx}px)`;
  });
  const end = e => {
    const p = s.p; if (!p || e.pointerId !== p.id) return;
    s.p = null; el.classList.remove("grabbing");
    if (p.axis !== "x") return;
    const w = el.clientWidth; let i = s.i;
    if ((p.dx < -w * 0.2 || p.v < -0.4) && i < s.n - 1) i++;
    else if ((p.dx > w * 0.2 || p.v > 0.4) && i > 0) i--;
    slideTo(s, i, 350);
    if (e.type === "pointerup") { s.swallow = true; setTimeout(() => { s.swallow = false; }, 0); }
  };
  el.addEventListener("pointerup", end);
  el.addEventListener("pointercancel", end);
  el.addEventListener("click", e => { if (s.swallow) { e.stopPropagation(); e.preventDefault(); s.swallow = false; } }, true);
  return s;
}
// Card auto-play: every 5 s per card, cards offset by 1 s; only while on screen; never after a manual swipe.
const autoPlay = { list: [], tick: 0, base: 0, io: null };
function setupAutoPlay(root) {
  if (autoPlay.io) autoPlay.io.disconnect();
  autoPlay.list = []; autoPlay.base = autoPlay.tick;
  autoPlay.io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(en => { if (en.target._s) en.target._s.visible = en.isIntersecting; }), { threshold: 0.5 }) : null;
  root.querySelectorAll(".card .slider").forEach(el => {
    const s = initSlider(el, el.parentElement.querySelector(".dots"), true);
    if (!s) return;
    autoPlay.list.push(s);
    if (autoPlay.io) autoPlay.io.observe(el); else s.visible = true;
  });
}
setInterval(() => {
  autoPlay.tick++;
  if (reduceMotion()) return;
  const t = autoPlay.tick - autoPlay.base;
  autoPlay.list.forEach((s, k) => {
    if (t < 5 || (t - k) % 5 !== 0 || !s.visible || s.manual || s.p) return;
    slideTo(s, s.i + 1, 500);
  });
}, 1000);

/* ================= Routes list ================= */
function payloadFor(view) {
  return { high: "high_confidence", low: "low_confidence", no_result: "no_result", error: "error", cold: "no_result", cancelled: "no_result" }[view];
}
function visibleRoutes() {
  if (S.view === "waiting") return [];
  const p = S.data[payloadFor(S.view)];
  return S.view === "cold" ? p.routes.slice(0, 2) : p.routes;
}
function renderSearchbar() {
  const q = S.query;
  $("#searchbar").innerHTML = `
    <button class="open-search" data-action="open-search" aria-label="${q ? "Search: " + esc(q) : "Search or describe the route"}">
      ${ic("search")}<span class="txt${q ? "" : " ph"}">${esc(q || "Search or describe the route")}</span>
    </button>
    ${q ? `<button class="clear icon-btn" data-action="clear-search" aria-label="Clear search">${ic("clear")}</button>` : ""}`;
}
function renderRoutesSheet() {
  const v = S.view, el = $("#routesSheet");
  let h = `<div class="grabber"></div>`;
  if (v === "waiting") {
    h += `<div class="waitline" role="status">Checking routes for your description… <button class="textlink" data-action="cancel">Cancel</button></div>`;
    h += skeletonCard() + skeletonCard();
  } else {
    const p = S.data[payloadFor(v)], routes = visibleRoutes();
    const low = v === "low", showAi = v === "high" || v === "low";
    if (low && p.framing) h += `<div class="framing">${esc(p.framing)}<br><button class="textlink" data-action="edit-search">Change search</button></div>`;
    if ((v === "no_result" || v === "error") && p.message && S.bannerOpen) {
      const primary = v === "error" ? `<button class="pill primary" data-action="try-again">Try again</button>` : `<button class="pill primary" data-action="edit-search">Edit search</button>`;
      h += `<div class="banner" role="status"><h3>${esc(p.message.title)}</h3><p>${esc(p.message.text)}</p><div class="btns">${primary}<button class="pill outline" data-action="dismiss">Dismiss</button></div></div>`;
    }
    const n = routes.length;
    const count = { high: `${n} hikes`, low: `${n} hikes`, no_result: `${n} hikes nearby, no AI summaries`, error: `${n} hikes nearby, no AI summaries`,
      cold: "Popular hikes nearby", cancelled: `You stopped the route check.<br>Here are ${n} hikes nearby, no AI summaries` }[v];
    h += `<div class="countline" ${v === "cancelled" ? 'role="status"' : ""}>${count}</div>`;
    h += routes.map(r => routeCard(r, low, showAi)).join("");
  }
  el.innerHTML = h;
  setupAutoPlay(el);
}
function renderRoutes(resetScroll = true) {
  renderSearchbar();
  renderRoutesSheet();
  if (resetScroll) { $("#routesSheet").scrollTop = 0; setSheet(SHEET_MAX, false); }
  updateMarkers();
}

/* ================= Route detail / saved ================= */
function renderDetail(kind) {
  const r = S.route, low = S.routeIsLow, saved = kind === "saved";
  const scr = $(saved ? "#saved" : "#detail");
  const gallery = ROUTE_PHOTOS[r.title] || [];
  const car = scr.querySelector('[data-slot="carousel"]'), dots = scr.querySelector('[data-slot="dots"]');
  car.innerHTML = sliderHTML(gallery, false);
  dots.innerHTML = dotsHTML(gallery.length).replace(/^<span class="dots">|<\/span>$/g, "");
  initSlider(car.querySelector(".slider"), dots, false);
  scr.querySelector('[data-slot="photocount"]').innerHTML = r.photo_count != null ? `${ic("image")}<span>${fmtThousands(r.photo_count)}</span>` : "";
  scr.querySelector('[data-slot="photocount"]').style.display = r.photo_count != null ? "" : "none";
  let h = "";
  if (saved) h += `<div class="planned"><span class="avatar-sun"><svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true"><use href="#ic-sun"/></svg></span><span><b>You planned a hike</b><small>Just now · Berlin, Germany</small></span></div>`;
  h += `<div class="rowtop">${r.difficulty ? `<span class="chip-easy">${esc(r.difficulty)}</span>` : ""}${saved ? "" : ratingLine(r)}</div>`;
  h += `<h1>${esc(r.title)}</h1>`;
  if (!saved && r.route_type) h += `<div class="typeline"><span>${ic("loop")}${esc(r.route_type)}</span><span>${ic("hiker")}Hiking</span></div>`;
  if (r.ai) h += aiBox(r.ai, low, { seeTips: true });
  h += `<div class="statgrid">
    <div><div class="k">Duration</div><div class="v">${fmtDuration(r.duration_min)}</div></div>
    <div><div class="k">Distance</div><div class="v">${fmtKm(r.distance_km)}</div></div>
    <div><div class="k">Elevation Gain</div><div class="v">${r.elevation_gain_m} m</div></div>
    <div><div class="k">Elevation Loss</div><div class="v">${r.elevation_loss_m != null ? r.elevation_loss_m + " m" : "–"}</div></div></div>`;
  $(saved ? "#savedBody" : "#detailBody").innerHTML = h;
  $(saved ? "#savedScroll" : "#detailScroll").scrollTop = 0;
}

/* ================= What people say ================= */
function renderWps() {
  const r = S.route, ai = r.ai, low = S.routeIsLow;
  const tips = ai.tips || [];
  let h = `<button class="backbtn icon-btn" data-action="back" aria-label="Back">${ic("back")}</button>
    <h1>What people say</h1><p class="sub">${esc(r.title)}</p>
    <div class="wps-ai${low ? " low" : ""}">${aiLabelRow(ai, low)}
    <div class="wps-signal">${esc(ai.signal)}</div></div>`;
  h += tips.map((t, i) => `<button class="tip" data-action="noop" aria-label="Tip from ${esc(t.author)}, ${esc(t.age)}: ${esc(t.text)}">
      <span class="tb"><span class="who"><span class="av" style="background:${AVATAR_COLORS[i % AVATAR_COLORS.length]}">${esc(t.author.charAt(0))}</span><span class="name">${esc(t.author)}</span><span class="age">· ${esc(t.age)}</span></span>
      <span class="tt" style="display:-webkit-box">${esc(t.text)}</span></span>${ic("chevright")}</button>`).join("");
  if (!low) h += `<button class="moretips" data-action="noop">More tips ${ic("chevdown")}</button>`;
  h += `<div class="feedback"><div class="box"><span class="q">Was this summary helpful?</span>
    <button class="thumb icon-btn" data-action="thumb-up" aria-label="Helpful" aria-pressed="${S.thumbsUp}">${ic("thumbup")}</button>
    <button class="thumb icon-btn" data-action="thumb-down" aria-label="Not helpful">${ic("thumbup", 'style="transform:rotate(180deg)"')}</button></div></div>`;
  $("#wpsBody").innerHTML = h;
  $("#wps .scroll").scrollTop = 0;
}

/* ================= Report ================= */
function renderReport() {
  S.reason = null;
  let h = `<button class="backbtn icon-btn" data-action="back" aria-label="Back">${ic("back")}</button>
    <h1>What’s wrong with this summary?</h1><p class="sub">${esc(S.route.title)}</p>
    <ul class="reasons" role="radiogroup" aria-label="Reason">`;
  h += REASONS.map(([t, d], i) => `<li><label><input type="radio" name="reason" value="${i}"><span><b>${t}</b><span class="d">${d}</span></span></label></li>`).join("");
  h += `</ul>`;
  $("#reportBody").innerHTML = h;
  $("#submitReport").setAttribute("aria-disabled", "true");
}

/* ================= Maps ================= */
const maps = {};
let markers = [];
function restyle(map) {
  const st = map.getStyle(); if (!st || !st.layers) return;
  const set = (id, p, v) => { try { map.setPaintProperty(id, p, v); } catch (e) {} };
  const hide = id => { try { map.setLayoutProperty(id, "visibility", "none"); } catch (e) {} };
  for (const L of st.layers) {
    const id = L.id, sl = L["source-layer"] || "", t = L.type, lid = id.toLowerCase();
    if (t === "background") { set(id, "background-color", "#E4E6C4"); continue; }
    if (t === "raster" || t === "hillshade") { hide(id); continue; }
    if (t === "fill-extrusion") { hide(id); continue; }
    if (t === "symbol") {
      const keep = (sl === "place" && /city|town|suburb|quarter|neighbourhood/.test(lid) && !/country|state|continent/.test(lid)) || sl === "water_name";
      if (!keep) hide(id);
      else { try { map.setLayoutProperty(id, "text-size", 11); } catch (e) {} set(id, "text-color", sl === "water_name" ? "#4C7EA8" : "#6E6656"); set(id, "text-halo-color", "rgba(255,255,255,.8)"); }
      continue;
    }
    if (t === "fill") {
      if (sl === "water") { set(id, "fill-color", "#A8CBE6"); set(id, "fill-opacity", 1); }
      else if (sl === "park") { set(id, "fill-color", "#B0B889"); set(id, "fill-opacity", 1); }
      else if (sl === "landcover") {
        if (/wood|forest|grass|scrub|wetland|park|farmland|meadow/.test(lid)) { set(id, "fill-color", "#B0B889"); set(id, "fill-opacity", 1); }
        else set(id, "fill-color", "#E4E6C4");
      } else if (sl === "landuse") {
        if (/park|cemetery|pitch|grass|garden|playground|wood/.test(lid)) { set(id, "fill-color", "#B0B889"); set(id, "fill-opacity", 1); }
        else { set(id, "fill-color", "#D9D9D9"); set(id, "fill-opacity", 1); }
      } else if (sl === "building") { set(id, "fill-color", "#D2D0C8"); set(id, "fill-outline-color", "#C6C3BA"); }
      else if (sl === "aeroway") set(id, "fill-color", "#D9D9D9");
      continue;
    }
    if (t === "line") {
      if (sl === "waterway") { set(id, "line-color", "#8DBCE0"); continue; }
      if (sl === "boundary" || sl === "park" || sl === "landuse" || sl === "landcover") { hide(id); continue; }
      if (sl === "transportation") {
        const casing = /casing|outline/.test(lid);
        if (/rail|transit|subway|tram/.test(lid)) { set(id, "line-color", "#B9B6AC"); continue; }
        if (/motorway|trunk|primary|major/.test(lid)) set(id, "line-color", casing ? "#D9782F" : "#F2A35A");
        else if (/secondary|tertiary/.test(lid)) set(id, "line-color", casing ? "#E9B98A" : "#F7CF9E");
        else if (casing) hide(id);
        else set(id, "line-color", "#C3C0B6");
      }
    }
  }
}
function lakeLoop() {
  // Approximate loop around Rummelsburger See (elongated SW–NE ellipse with a little wobble)
  const c = [13.4805, 52.4982], a = 980, b = 300, rot = 28 * Math.PI / 180, pts = [];
  for (let i = 0; i <= 64; i++) {
    const t = i / 64 * Math.PI * 2, w = 1 + 0.06 * Math.sin(t * 3) + 0.04 * Math.cos(t * 5);
    const x = a * Math.cos(t) * w, y = b * Math.sin(t) * w;
    const xr = x * Math.cos(rot) - y * Math.sin(rot), yr = x * Math.sin(rot) + y * Math.cos(rot);
    pts.push([c[0] + xr / (111320 * Math.cos(c[1] * Math.PI / 180)), c[1] + yr / 111320]);
  }
  return pts;
}
function addLoop(map) {
  try {
    map.addSource("loop", { type: "geojson", data: { type: "Feature", geometry: { type: "LineString", coordinates: lakeLoop() } } });
    map.addLayer({ id: "loop-casing", type: "line", source: "loop", layout: { "line-join": "round", "line-cap": "round" }, paint: { "line-color": "#fff", "line-width": 6 } });
    map.addLayer({ id: "loop-line", type: "line", source: "loop", layout: { "line-join": "round", "line-cap": "round" }, paint: { "line-color": "#2B6BEA", "line-width": 3.5 } });
  } catch (e) {}
}
function makeMap(id, opts) {
  if (maps[id] !== undefined) { if (maps[id]) maps[id].resize(); return maps[id]; }
  maps[id] = null;
  if (!window.maplibregl) return null;
  try {
    const m = new maplibregl.Map(Object.assign({ container: id, style: MAP_STYLE, attributionControl: { compact: true }, fadeDuration: 0 }, opts));
    m.on("error", () => {});
    m.on("load", () => { restyle(m); if (opts.loop) addLoop(m); });
    maps[id] = m;
    return m;
  } catch (e) { return null; }
}
function ensureRoutesMap() {
  const m = makeMap("routesMap", { center: ROUTES_CENTER, zoom: 12, dragRotate: false, pitchWithRotate: false });
  if (m && !m._padded) { m.setPadding({ top: 0, bottom: 320, left: 0, right: 0 }); m.jumpTo({ center: ROUTES_CENTER, zoom: 12 }); m._padded = true; }
  updateMarkers();
}
function updateMarkers() {
  const m = maps.routesMap; if (!m || !window.maplibregl) return;
  markers.forEach(mk => mk.remove()); markers = [];
  visibleRoutes().forEach((r, i) => {
    const pos = MARKER_POS[r.title]; if (!pos) return;
    const el = document.createElement("div");
    el.setAttribute("aria-hidden", "true");
    el.style.cssText = `width:34px;height:34px;border-radius:17px;background:${MARKER_COLORS[i % MARKER_COLORS.length]};border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;pointer-events:none`;
    el.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" style="fill:#fff"><path d="M20.5 3.5 3.5 10.5l7.5 2.5 2.5 7.5z"/></svg>`;
    markers.push(new maplibregl.Marker({ element: el }).setLngLat(pos).addTo(m));
  });
}
function ensureMini(id) {
  makeMap(id, { center: [13.4805, 52.4982], zoom: 12.35, interactive: false, attributionControl: false, loop: true });
}
function ensureNavMap() {
  const pts = lakeLoop(), p = pts[40];
  const m = makeMap("navMap", { center: p, zoom: 16.3, dragRotate: false, pitchWithRotate: false, loop: true });
  if (m && !m._dot) {
    const el = document.createElement("div"); el.className = "posdot"; el.setAttribute("aria-hidden", "true");
    new maplibregl.Marker({ element: el }).setLngLat(p).addTo(m); m._dot = true;
  }
}

/* ================= Router ================= */
const NAV_SCREENS = ["routes", "detail", "saved", "wps", "report"];
const LIGHT_STATUS = ["detail", "saved", "nav"];
let screenTrans = null;
function animateScreens(prev, next, type) {
  const reduce = reduceMotion();
  const opts = reduce ? { duration: 200, easing: "ease" } : { duration: 350, easing: "cubic-bezier(0.32, 0.72, 0, 1)" };
  const top = type === "push" ? next : prev, under = top === next ? prev : next;
  top.style.zIndex = "2"; under.style.zIndex = "1";
  const shade = "-10px 0 24px rgba(27,26,24,.18)";
  let anims;
  if (reduce) {
    anims = [type === "push" ? next.animate([{ opacity: 0 }, { opacity: 1 }], opts) : prev.animate([{ opacity: 1 }, { opacity: 0 }], opts)];
  } else if (type === "push") {
    anims = [next.animate([{ transform: "translateX(100%)", boxShadow: shade }, { transform: "translateX(0)", boxShadow: shade }], opts),
             prev.animate([{ transform: "translateX(0)", filter: "brightness(1)" }, { transform: "translateX(-30%)", filter: "brightness(.88)" }], opts)];
  } else {
    anims = [prev.animate([{ transform: "translateX(0)", boxShadow: shade }, { transform: "translateX(100%)", boxShadow: shade }], opts),
             next.animate([{ transform: "translateX(-30%)", filter: "brightness(.88)" }, { transform: "translateX(0)", filter: "brightness(1)" }], opts)];
  }
  const done = () => {
    if (screenTrans !== t) return;
    screenTrans = null;
    anims.forEach(a => a.cancel());
    prev.classList.remove("active");
    prev.style.zIndex = ""; next.style.zIndex = "";
  };
  const t = { finish: done };
  screenTrans = t;
  anims[0].onfinish = done;
}
function show(id, focusTarget, anim) {
  if (screenTrans) screenTrans.finish();
  const prev = document.querySelector(".screen.active");
  const next = document.getElementById(id);
  if (anim && prev && prev !== next) next.classList.add("active");
  else document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s === next));
  $("#statusbar").classList.toggle("light", LIGHT_STATUS.includes(id));
  const scr = document.getElementById(id);
  const slot = scr.querySelector(".tabslot");
  if (slot && !slot.innerHTML && NAV_SCREENS.includes(id)) slot.innerHTML = tabbar();
  if (id === "routes") { renderRoutes(false); ensureRoutesMap(); }
  if (id === "detail") { renderDetail("detail"); ensureMini("detailMini"); }
  if (id === "saved") { renderDetail("saved"); ensureMini("savedMini"); }
  if (id === "wps") renderWps();
  if (id === "report") renderReport();
  if (id === "nav") ensureNavMap();
  if (id === "search") { const inp = $("#searchInput"); inp.value = S.query; syncGo(); }
  if (anim && prev && prev !== next) animateScreens(prev, next, anim);
  requestAnimationFrame(() => {
    Object.values(maps).forEach(m => m && m.resize());
    (focusTarget ? $(focusTarget) : scr).focus({ preventScroll: true });
  });
}
const top_ = () => S.stack[S.stack.length - 1];
function go(id, f) { S.stack.push(id); show(id, f, "push"); }
function back() { if (S.stack.length > 1) S.stack.pop(); show(top_(), null, "pop"); }
function replaceTop(id) { S.stack[S.stack.length - 1] = id; show(id); }

/* ================= Search + waiting ================= */
function clearTimers() { S.timers.forEach(clearTimeout); S.timers = []; }
function resolveState(next) { return next === "cold" ? "high" : next; }
function runSearch(q) {
  if (PAGE !== "index") {                           // search page: same pop to the list, then load the routes list page
    try { sessionStorage.setItem("preView", S.view); } catch (_) {}
    S.query = q;
    nav("index", { run: 1 }, "pop");
    return;
  }
  clearTimers();
  S.query = q;
  if (screenTrans) screenTrans.finish();
  const from = document.querySelector(".screen.active");
  S.stack = ["routes"];
  show("routes", null, from && from.id === "search" ? "pop" : null);   // same results, new text — nothing else changes for 0.8 s
  S.timers.push(setTimeout(() => {
    S.view = "waiting"; S.bannerOpen = true; renderRoutes();
    const target = resolveState(S.nextState);
    if (target !== "waiting") S.timers.push(setTimeout(() => { S.view = target; S.bannerOpen = true; renderRoutes(); syncURL(); }, 4000));
    else syncURL();
  }, 800));
}
function applyState(v) {
  if (navigating) return;                           // switcher: load the routes list in that state, no animation
  navigating = true;
  location.assign(`index.html?state=${STATE_OUT[v]}&switcher=1${URLP.task ? `&task=${URLP.task}` : ""}`);
}

/* ================= Route saved sheet ================= */
let sheetReturn = null;
function openSheet() {
  $("#nameField").value = S.route.title;
  const ov = $("#saveOverlay");
  clearTimeout(ov._t);
  ov.classList.add("open");
  void ov.offsetWidth;                               // start from the closed position, then slide up
  ov.classList.add("in");
  $("#detail").setAttribute("aria-hidden", "true");
  $("#statusbar").classList.remove("light");
  requestAnimationFrame(() => $("#savedTitle").focus());
}
function closeSheet(toSaved = true) {
  const ov = $("#saveOverlay");
  if (!ov.classList.contains("in")) { if (!toSaved) { clearTimeout(ov._t); ov.classList.remove("open"); } return; }
  ov.classList.remove("in");
  $("#detail").removeAttribute("aria-hidden");
  if (toSaved) {                                     // saved route appears underneath while the sheet slides down
    replaceTop("saved");
    clearTimeout(ov._t);
    ov._t = setTimeout(() => ov.classList.remove("open"), reduceMotion() ? 220 : 370);
  } else { clearTimeout(ov._t); ov.classList.remove("open"); }
}

/* ================= Actions ================= */
const BACK_TO = { search: "index", route: "index", "saved-route": "index", report: "tips" };
const actions = {
  noop() {},
  back() { nav(PAGE === "tips" ? (URLP.from === "saved" ? "saved-route" : "route") : (BACK_TO[PAGE] || "index"), {}, "pop"); },
  "open-search"() { nav("search", {}, "push"); },
  "clear-search"() { clearTimers(); S.query = ""; S.view = "cold"; S.bannerOpen = true; renderRoutes(); syncURL(); $("#routes").focus(); },
  "edit-search"() { nav("search", {}, "push"); },
  "clear-input"() { const i = $("#searchInput"); i.value = ""; syncGo(); i.focus(); },
  example(el) { runSearch(el.dataset.q); },
  cancel() { clearTimers(); S.view = "cancelled"; renderRoutes(); syncURL(); },
  "try-again"() { runSearch(S.query); },
  "map-pill"() { setSheet(SHEET_MAX, true); $("#routesSheet").scrollTop = 0; $("#routes").focus(); },
  dismiss() { S.bannerOpen = false; renderRoutesSheet(); $("#routesSheet").focus(); syncURL(); },
  "open-route"() {
    const p = S.data[payloadFor(S.view)];
    S.route = p.routes.find(r => r.title === ACTIVE_ROUTE);
    S.routeIsLow = S.view === "low";
    S.thumbsUp = false;
    nav("route", {}, "push");
  },
  "see-tips"() { nav("tips", { from: PAGE === "saved-route" ? "saved" : null }, "push"); },
  "thumb-up"(el) { S.thumbsUp = !S.thumbsUp; el.setAttribute("aria-pressed", String(S.thumbsUp)); },
  "thumb-down"() { nav("report", {}, "push"); },
  "submit-report"() { if (S.reason == null) return; nav("report-received", {}, "push"); },
  "back-to-route"() { nav(URLP.from === "saved" ? "saved-route" : "route", {}, "pop"); },
  save() {                                          // the sheet slides up as before, then the Route saved page loads
    if (navigating) return;
    navigating = true;
    openSheet();
    setTimeout(() => location.assign(pageURL("saved")), reduceMotion() ? 220 : 370);
  },
  "close-sheet"() { closeSaved(); },
  navigate() { nav("navigation", {}, "push"); },
  "end-nav"() { nav("saved-route", {}, "pop"); }
};
// Done / ✕ / Esc: the sheet slides down with the saved route underneath, then the saved route page loads.
function closeSaved() {
  if (navigating || !$("#saveOverlay").classList.contains("in")) return;
  navigating = true;
  closeSheet(true);
  setTimeout(() => location.assign(pageURL("saved-route")), reduceMotion() ? 220 : 370);
}
document.addEventListener("click", e => {
  const el = e.target.closest("[data-action]");
  if (!el || !$("#phone").contains(el)) return;
  e.preventDefault();
  const fn = actions[el.dataset.action];
  if (fn) fn(el);
});
document.addEventListener("change", e => {
  if (e.target.name === "reason") { S.reason = +e.target.value; $("#submitReport").setAttribute("aria-disabled", "false"); }
  if (e.target.name === "state") applyState(e.target.value);
});
function syncGo() { $("#searchForm .go").hidden = !$("#searchInput").value.trim(); }
$("#searchInput").addEventListener("input", syncGo);
$("#searchForm").addEventListener("submit", e => {
  e.preventDefault();
  const q = $("#searchInput").value.trim();
  if (q) runSearch(q);
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && $("#saveOverlay").classList.contains("in")) closeSaved();
});

/* ================= Bottom sheet: pull up over the map, then scroll ================= */
const SHEET_MAX = 210;               // offset when collapsed (sheet top at 380); 0 = top position under the chips
let sheetOff = SHEET_MAX;
function setSheet(off, animate) {
  sheetOff = Math.max(0, Math.min(SHEET_MAX, off));
  const sh = $("#routesSheetWrap"), cover = $("#mapCover");
  sh.classList.toggle("snap", !!animate);
  sh.style.transform = `translateY(${sheetOff}px)`;
  cover.style.transition = animate ? "opacity .3s" : "none";
  cover.style.opacity = String(1 - sheetOff / SHEET_MAX);
  cover.classList.toggle("blocking", sheetOff < SHEET_MAX);
  $("#mapPill").classList.toggle("show", sheetOff === 0);
}
function settle(startOff, lastDy, speed) {
  if (sheetOff === 0 || sheetOff === SHEET_MAX) return;
  const moved = Math.abs(sheetOff - startOff);
  let up;
  if ((moved > 30 || speed > 0.3) && lastDy) up = lastDy < 0;        // follow the last direction
  else up = startOff === 0 ? true : startOff === SHEET_MAX ? false : sheetOff < SHEET_MAX / 2;
  setSheet(up ? 0 : SHEET_MAX, true);
}
// dy > 0: finger/mouse moves down (content follows). Moves the sheet first, then the list.
function dragBy(dy) {
  const sc = $("#routesSheet");
  if (dy < 0) {
    const use = Math.min(-dy, sheetOff);
    if (use) setSheet(sheetOff - use);
    const rest = -dy - use;
    if (rest) sc.scrollTop += rest;
  } else if (dy > 0) {
    const use = Math.min(dy, sc.scrollTop);
    if (use) sc.scrollTop -= use;
    const rest = dy - use;
    if (rest) setSheet(sheetOff + rest);
  }
}
(function initSheet() {
  const sh = $("#routesSheetWrap"), sc = $("#routesSheet");
  // Mouse wheel and trackpad
  let wStart = null, wTimer = 0, wLast = 0;
  sh.addEventListener("wheel", e => {
    let dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 600 : 1);
    if (!((dy > 0 && sheetOff > 0) || (dy < 0 && sc.scrollTop <= 0 && sheetOff < SHEET_MAX))) return;
    e.preventDefault();
    if (wStart === null) wStart = sheetOff;
    sh.classList.remove("snap");
    setSheet(sheetOff - dy);
    wLast = -dy;
    clearTimeout(wTimer);
    wTimer = setTimeout(() => { settle(wStart, wLast, 0); wStart = null; }, 150);
  }, { passive: false });

  // Touch
  let t = null;
  sh.addEventListener("touchstart", e => {
    if (e.touches.length !== 1) { t = null; return; }
    const y = e.touches[0].clientY;
    t = { x0: e.touches[0].clientX, y0: y, lastY: y, lastT: e.timeStamp, startOff: sheetOff, mode: null, lastDy: 0, v: 0 };
  }, { passive: true });
  sh.addEventListener("touchmove", e => {
    if (!t) return;
    const y = e.touches[0].clientY, dy = y - t.lastY;
    if (!dy) return;
    if (!t.mode) {
      const tdx = e.touches[0].clientX - t.x0, tdy = y - t.y0;
      if (Math.max(Math.abs(tdx), Math.abs(tdy)) < 6) return;
      if (Math.abs(tdx) > Math.abs(tdy)) { t.mode = "none"; return; }     // horizontal: a photo swipe, not the sheet
      t.mode = ((tdy < 0 && sheetOff > 0) || (tdy > 0 && sc.scrollTop <= 80 && sheetOff < SHEET_MAX)) ? "sheet" : "native";
    }
    if (t.mode !== "sheet") return;
    e.preventDefault();
    sh.classList.remove("snap");
    dragBy(dy);
    const dt = Math.max(1, e.timeStamp - t.lastT);
    t.v = Math.abs(dy) / dt; t.lastDy = dy; t.lastY = y; t.lastT = e.timeStamp;
  }, { passive: false });
  const touchEnd = () => { if (t && t.mode === "sheet") settle(t.startOff, t.lastDy, t.v); t = null; };
  sh.addEventListener("touchend", touchEnd);
  sh.addEventListener("touchcancel", touchEnd);

  // Mouse drag
  let m = null, swallowClick = false;
  sh.addEventListener("pointerdown", e => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    m = { x: e.clientX, y: e.clientY, lastY: e.clientY, lastT: e.timeStamp, startOff: sheetOff, total: 0, lastDy: 0, v: 0, axis: null };
  });
  window.addEventListener("pointermove", e => {
    if (!m || e.pointerType !== "mouse") return;
    if (!m.axis) {
      const tdx = e.clientX - m.x, tdy = e.clientY - m.y;
      if (Math.max(Math.abs(tdx), Math.abs(tdy)) < 6) return;
      if (Math.abs(tdx) > Math.abs(tdy)) { m = null; return; }            // horizontal: a photo swipe, not the sheet
      m.axis = "y";
    }
    const dy = e.clientY - m.lastY;
    if (!dy) return;
    m.total += Math.abs(dy);
    if (m.total > 5) { sh.classList.add("dragging"); sh.classList.remove("snap"); }
    else return;
    dragBy(dy);
    const dt = Math.max(1, e.timeStamp - m.lastT);
    m.v = Math.abs(dy) / dt; m.lastDy = dy; m.lastY = e.clientY; m.lastT = e.timeStamp;
  });
  window.addEventListener("pointerup", () => {
    if (!m) return;
    if (m.total > 5) { swallowClick = true; setTimeout(() => { swallowClick = false; }, 0); settle(m.startOff, m.lastDy, m.v); }
    sh.classList.remove("dragging");
    m = null;
  });
  sh.addEventListener("click", e => { if (swallowClick) { e.stopPropagation(); e.preventDefault(); swallowClick = false; } }, true);
})();

/* ================= Boot ================= */
Promise.all(["high_confidence", "low_confidence", "no_result", "error"].map(n =>
  fetch(`data/${n}.json`).then(r => { if (!r.ok) throw new Error(n); return r.json(); }).then(j => [n, j])))
  .then(list => { S.data = Object.fromEntries(list); bootPage(); })
  .catch(() => { $(".switcher").hidden = false; $("#loadError").hidden = false; });

function initFromURL() {
  S.nextState = STATE_IN[URLP.state];
  if (URLP.view === "nearby") {                     // after ✕ on the results screen: nearby hikes, no query, state kept
    S.query = ""; S.view = "cold";
  } else {
    S.query = URLP.q != null ? URLP.q : (S.nextState === "cold" ? "" : DEFAULT_QUERY);
    S.view = URLP.view || (S.nextState === "cold" && S.query ? resolveState("cold") : S.nextState);
  }
  S.bannerOpen = URLP.banner;
  S.route = routeForView(S.view);
  S.routeIsLow = S.view === "low";
}
function openSheetInstantly() {
  const ov = $("#saveOverlay");
  ov.classList.add("instant");
  openSheet();
  requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.remove("instant")));
}
function renderPage() {
  closeSheet(false);
  const screen = PAGE_SCREEN[PAGE] || "routes";
  if (PAGE === "index") {
    S.stack = ["routes"];
    show("routes");
    renderRoutes();
  } else {
    S.stack = [screen];
    show(screen, screen === "search" ? "#searchInput" : null);
    if (PAGE === "search" && URLP.clear) { $("#searchInput").value = ""; syncGo(); }
    if (PAGE === "saved") openSheetInstantly();
  }
}
function bootPage() {
  $(".switcher").hidden = !URLP.switcher;
  const radio = $(`input[name=state][value=${STATE_IN[URLP.state]}]`);
  if (radio) radio.checked = true;
  initFromURL();
  if (PAGE === "index" && URLP.run) {               // arrived from a search: run the same 0.8 s + waiting sequence as before
    let pre = null;
    try { pre = sessionStorage.getItem("preView"); sessionStorage.removeItem("preView"); } catch (_) {}
    if (pre) S.view = pre;
    renderPage();
    history.replaceState(null, "", pageURL("index"));
    runSearch(S.query);
  } else {
    renderPage();
  }
}
// Browser back/forward from the page cache: show this page's own screen again.
window.addEventListener("pageshow", e => {
  if (!e.persisted || !S.data) return;
  navigating = false;
  if (screenTrans) screenTrans.finish();
  initFromURL();
  renderPage();
});
