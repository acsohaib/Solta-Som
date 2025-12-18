let grille = 10;
let grilleOndes = 4;
let grilleDroite = 20;
let sound;
let amp;
let masque;
const masqueSrc = 'images/masque2.png';
let videoGauche;
let videoDroite;

let feuilleGauche;
let feuilleMilieu;
let feuilleDroite;


let ecranAccueil = true;
let boutonsSon = [];
let sonSelectionne = null;


function afficherMasque() {
  let image = select('#masque');
  if (!image) {
    image = createImg(masqueSrc);
    image.id('masque');
  }
  image.position(0, 0);
  image.size(windowWidth, windowHeight);
  image.style('pointer-events', 'none');
  image.show();
}

function masquerMasque() {
  const image = select('#masque');
  if (image) {
    image.remove();
  }
}

const banqueSons = [
  { nom: 'Botano (Útero Baixo)', fichier: 'sound/botano.mp3' },
  { nom: 'Minha Pika Ta Dura', fichier: 'sound/minha.mp3' },
  { nom: 'Bota Palma da Mão no Chão', fichier: 'sound/botapalma.mp3' },
  { nom: 'Sem Palavrão', fichier: 'sound/palavrao.mp3' },
  { nom: 'Sequencia Da Ralação', fichier: 'sound/ralacao.mp3' }
];

let fonte;
let font;

function preload() {
  masque = loadImage('images/masque2.png');
  fonte = loadFont('fonts/reihnerbold.otf');
  font = loadFont('fonts/reighneritalic.otf');
}

function afficherCompteurFrames() {
  const fps = frameRate();
  const lignes = [`FPS : ${fps.toFixed(1)}`, `Frame : ${frameCount}`];
  const pad = 8;
  
  push();
  textSize(16);
  textAlign(LEFT, TOP);
  const blocLargeur = max(lignes.map((ligne) => textWidth(ligne))) + pad * 2;
  const blocHauteur = lignes.length * (textAscent() + textDescent()) + pad * 2;
  
  fill(0, 0, 0, 0.6);
  noStroke();
  rect(pad, pad, blocLargeur, blocHauteur, 6);
  
  fill(0, 0, 100);
  noStroke();
  lignes.forEach((ligne, index) => {
    text(ligne, pad * 2, pad * 2 + index * (textAscent() + textDescent()));
  });
  pop();
}

function setup() {
  colorMode(HSL);
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  amp = new p5.Amplitude();
  
  if (masque) {
    masque.resize(width, 0);
  }
  

  let image = select('#masque');
  if (image) {
    masquerMasque();
  }
  

  creerBoutonsSon();
  
  const largeurZone = width / 3;
  feuilleGauche = createGraphics(largeurZone, height);
  feuilleMilieu = createGraphics(largeurZone, height);
  feuilleDroite = createGraphics(largeurZone, height);
  
  feuilleGauche.colorMode(HSL);
  feuilleMilieu.colorMode(HSL);
  feuilleDroite.colorMode(HSL);
  feuilleDroite.textAlign(CENTER, CENTER);

  videoGauche = createVideo('videos/parablanc.mp4', () => videoGauche.loop());
  videoGauche.volume(0);
  videoGauche.hide();
  videoGauche.size(800, 800);

  videoDroite = createVideo('videos/parablanc.mp4', () => videoDroite.loop());
  videoDroite.volume(0);
  videoDroite.hide();
  videoDroite.size(800, 800);
}

function creerBoutonsSon() {
  boutonsSon = [];
  const espacement = 80;
  const largeurBouton = 500;
  const hauteurBouton = 60;
  const startY = height / 2 - (banqueSons.length * espacement) / 2;
  
  for (let i = 0; i < banqueSons.length; i++) {
    boutonsSon.push({
      x: width / 2 - largeurBouton / 2,
      y: startY + i * espacement,
      w: largeurBouton,
      h: hauteurBouton,
      nom: banqueSons[i].nom,
      fichier: banqueSons[i].fichier,
      survol: false
    });
  }
}

function afficherEcranAccueil() {
  background(255);
  
  const videoY = height / 2 - 250;
  if (videoGauche) {
    image(videoGauche, 0, videoY, 500, 500);
  } else {
    fill(0);
    noStroke();
    rect(0, videoY, 300, 240);
  }

  if (videoDroite) {
    push();
    translate(width-500, videoY);
    scale(-1, 1);
    image(videoDroite, -500, 0, 500, 500);
    pop();
  } else {
    fill(0);
    noStroke();
    rect(width - 300, videoY, 300, 240);
  }
  
  // titre français
  push();
  textAlign(CENTER, CENTER);
  if (font) textFont(font);
  textSize(124);
  textStyle(ITALIC);
  fill(0);
  noStroke();
  text('(LÂCHE LE SON!)', width / 2, 120);
  pop();
  
  // boutons
  for (let bouton of boutonsSon) {
    // hover
    bouton.survol = mouseX > bouton.x && mouseX < bouton.x + bouton.w &&
                    mouseY > bouton.y && mouseY < bouton.y + bouton.h;
    
    push();
    textAlign(CENTER, CENTER);
    if (fonte) textFont(fonte);
    textSize(80);
    textStyle(BOLD);
    noStroke();
    
    // couleur hover
    if (bouton.survol) {
      fill(226, 77, 40); 
    } else {
      fill(0); 
    }
    
    text(bouton.nom, width / 2, bouton.y + bouton.h / 2);
    pop();
  }
  
  // titre portugais
  push();
  textAlign(CENTER);
  if (font) textFont(font);
  textSize(120);
  textStyle(ITALIC);
  fill(0);
  noStroke();
  text('(SOLTA O SOM!)', width / 2, height - 100);
  pop();
}

let zoom = 0.003;
let zoomOndes = 0.002;
let zoomTexte = 0.009;
let temps = 0;
let zoneSelection = null; 

function draw() {
  if (ecranAccueil) {
    afficherEcranAccueil();
    return;
  }
  
  let level = amp.getLevel();
  temps = temps + level * 0.5;
  
  background(0, 0, 100);
  
  const largeurZone = width / 3;
  
  if ((zoneSelection === 0 || zoneSelection === 1 || zoneSelection === 2 || zoneSelection === 3) && feuilleGauche.width !== width) {
    feuilleGauche = createGraphics(width, height);
    feuilleMilieu = createGraphics(width, height);
    feuilleDroite = createGraphics(width, height);
    feuilleGauche.colorMode(HSL);
    feuilleMilieu.colorMode(HSL);
    feuilleDroite.colorMode(HSL);
    feuilleDroite.textAlign(CENTER, CENTER);
  } else if (zoneSelection === null && feuilleGauche.width !== largeurZone) {
    feuilleGauche = createGraphics(largeurZone, height);
    feuilleMilieu = createGraphics(largeurZone, height);
    feuilleDroite = createGraphics(largeurZone, height);
    feuilleGauche.colorMode(HSL);
    feuilleMilieu.colorMode(HSL);
    feuilleDroite.colorMode(HSL);
    feuilleDroite.textAlign(CENTER, CENTER);
  }
  
  feuilleGauche.background(0, 0, 100);
  feuilleGauche.noStroke();
  
  let largeurAffichage = (zoneSelection === 0 || zoneSelection === 3) ? width : largeurZone;
  let hauteurAffichage = height;
  
  for (let x = 0; x < largeurAffichage; x += grille) {
    for (let y = 0; y < hauteurAffichage; y += grille) {
      let paramX = x * zoom;
      let paramY = y * zoom;
      
      const noise2d = noise(paramX + temps, paramY + temps) * grille * 2;
      let hue = 210 + map(noise2d, 0, grille * 2, -20, 20);
      let saturation = 100;
      let lightness = map(level, 0, 0.5, 30, 80);
      
      feuilleGauche.fill(hue, saturation, lightness);
      feuilleGauche.square(x, y, noise2d);
    }
  }
  
  feuilleMilieu.background(0, 0, 98);
  feuilleMilieu.noFill();
  feuilleMilieu.strokeWeight(1);
  feuilleMilieu.stroke(226, 77, 40, 0.9);
  
  largeurAffichage = (zoneSelection === 1 || zoneSelection === 3) ? width : largeurZone;
  
  for (let x = 0; x <= largeurAffichage; x += grilleOndes) {
    feuilleMilieu.beginShape();
    for (let y = 0; y <= hauteurAffichage; y += grilleOndes) {
      const nx = x * zoomOndes;
      const ny = y * zoomOndes;
      const n = noise(nx, ny, temps) * 120;
      const th = noise(nx, ny, temps);
      
      if (th > 0.55) {
        feuilleMilieu.vertex(x + n, y);
      } else {
        feuilleMilieu.vertex(x, y);
      }
    }
    feuilleMilieu.endShape();
  }
  
  feuilleMilieu.noStroke();
  feuilleMilieu.fill(0, 0, 100, map(level, 0, 0.35, 0, 0.25));
  feuilleMilieu.rect(0, 0, largeurAffichage, hauteurAffichage);
  
  feuilleDroite.background(0, 0, 100);
  
  largeurAffichage = (zoneSelection === 2 || zoneSelection === 3) ? width : largeurZone;
  let marge = 30;
  
  for (let x = marge; x < largeurAffichage - marge; x += grilleDroite) {
    for (let y = marge; y < hauteurAffichage - marge; y += grilleDroite) {
      let paramX = x * zoomTexte;
      let paramY = y * zoomTexte;
      
      let treshold = noise(paramX, paramY, temps);
      
      feuilleDroite.fill(226, 77, 40);
      feuilleDroite.stroke(55, 50, 50);
      feuilleDroite.strokeWeight(1);
      
      if (treshold > 0.5) {
        feuilleDroite.textSize(18);
        feuilleDroite.text('@', x, y);
      } else if (treshold > 0.4) {
        feuilleDroite.textSize(30);
        feuilleDroite.text('*', x, y);
      } else {
        feuilleDroite.textSize(30);
        feuilleDroite.text('.', x, y);
      }
    }
  }
  
  if (zoneSelection === null) {
    image(feuilleGauche, 0, 0);
    image(feuilleMilieu, largeurZone, 0);
    image(feuilleDroite, largeurZone * 2, 0);
    
    stroke(0, 0, 50, 0.3);
    strokeWeight(2);
    line(largeurZone, 0, largeurZone, height);
    line(largeurZone * 2, 0, largeurZone * 2, height);
  } else if (zoneSelection === 0) {
    image(feuilleGauche, 0, 0);
  } else if (zoneSelection === 1) {
    image(feuilleMilieu, 0, 0);
  } else if (zoneSelection === 2) {
    image(feuilleDroite, 0, 0);
  } else if (zoneSelection === 3) {
    image(feuilleGauche, 0, 0);
    blend(feuilleGauche, 0, 0, width, height, 0, 0, width, height, DODGE);
    blend(feuilleMilieu, 0, 0, width, height, 0, 0, width, height, ADD);
    blend(feuilleDroite, 0, 0, width, height, 0, 0, width, height, EXCLUSION);
  }
  
  afficherCompteurFrames();
}

function mousePressed() {
  // écran d'accueil
  if (ecranAccueil) {
    for (let bouton of boutonsSon) {
      if (bouton.survol) {
        sonSelectionne = bouton.fichier;
        chargerEtLancerSon(bouton.fichier);
        ecranAccueil = false;
        afficherMasque();
        return;
      }
    }
    return;
  }
  
  // trois zones
  userStartAudio();
  
  if (zoneSelection === null) {
    const largeurZone = width / 3;
    if (mouseX < largeurZone) {
      zoneSelection = 0; 
    } else if (mouseX < largeurZone * 2) {
      zoneSelection = 1; 
    } else {
      zoneSelection = 2; 
    }
  }
  
  let lecture = sound && sound.isPlaying();
  if (lecture == false && sound) {
    sound.play();
  }
}

function chargerEtLancerSon(fichier) {
  // charger son
  sound = loadSound(fichier, 
    () => {
      console.log('Son chargé:', fichier);
      userStartAudio();
      sound.loop();
      sound.setVolume(0.7);
    },
    (err) => {
      console.error('Erreur de chargement:', err);
    }
  );
}

function keyPressed() {
  if (key === 'h' || key === 'H') {
    if (sound && sound.isPlaying()) {
      sound.stop();
    }
    ecranAccueil = true;
    zoneSelection = null;
    masquerMasque();
    return;
  }

  if (key === 'm' || key === 'M') {
    zoneSelection = null;
    afficherMasque();
  }

  if (key === 'b' || key === 'B') {
    if (zoneSelection === 3) {
      zoneSelection = null; 
    } else {
      zoneSelection = 3; 
    }
  }
  
  if (key === 's' || key === 'S') {
    masquerMasque();
  }
  
  if (key === 'e' || key === 'E') {
    let image = createImg('images/masque9.png');
    image.position(0, 0);
  }
  
  if (key === ' ' && sound) {
    if (sound.isPlaying()) {
      sound.pause();
    } else {
      sound.loop();
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  
  if (ecranAccueil) {
    creerBoutonsSon();
  }
  
  const largeurZone = (zoneSelection === null) ? width / 3 : width;
  feuilleGauche = createGraphics(largeurZone, height);
  feuilleMilieu = createGraphics(largeurZone, height);
  feuilleDroite = createGraphics(largeurZone, height);
  
  feuilleGauche.colorMode(HSL);
  feuilleMilieu.colorMode(HSL);
  feuilleDroite.colorMode(HSL);
  feuilleDroite.textAlign(CENTER, CENTER);

  const image = select('#masque');
  if (image) {
    image.size(windowWidth, windowHeight);
    image.position(0, 0);
  }
}
