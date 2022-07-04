/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
// console.log('hi');

const zones = [
	"Green Hill",
	"Chemical Plant",
	"Studiopolis",
	"Flying Battery",
	"Press Garden",
	"Stardust Speedway",
	"Hydrocity",
	"Mirage Saloon",
	"Oil Ocean",
	"Lava Reef",
	"Metallic Madness",
	"Titanic Monarch",
  ];
  
  const animated_selectors = [
	".stripe-container",
	".shutter .before",
	".shutter .after",
	"#act",
	"#zone",
	"#zone-name",
	".text span"
  ].join(", ");

  const helpContainer = document.querySelector("#help-container");
  const helpButton = document.querySelector("#help-button button");
  
  replaceZone();
  window.addEventListener('hashchange', restart);
  window.document.addEventListener('keyup', function(e) {
	if (e.which === 32) restart();
  });

  if (helpContainer) {
	helpContainer.addEventListener('click', function(e) {
		if (e.currentTarget === e.target)
			helpContainer.classList.remove("active");
	})
  }

  if (helpButton && helpContainer) {
	helpButton.addEventListener('click', function() {
		helpContainer.classList.add("active");
	});
  }
  
  function restart() {
	if (helpContainer) helpContainer.classList.remove("active");
	const stripes = document.querySelectorAll(animated_selectors);
	Array.from(stripes).forEach(function(s) {
	  s.classList.add('reset');
	  setTimeout(function(){ s.classList.remove('reset'); }, 20);
	});
	replaceZone();
  }
  
  function replaceZone() {
	let zoneName = decodeURIComponent(window.location.hash.substring(1));
	if (!zoneName) zoneName = randomZone();
	const el = document.querySelector('#zone-name span');
	if (el) {
	  el.innerText = zoneName;
	}
	document.title = zoneName + " Zone";
  }
  
  function randomZone() {
	return zones[Math.floor(Math.random() * zones.length)];
  }