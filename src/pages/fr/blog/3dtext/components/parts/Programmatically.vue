<template lang="pug">
section
  h2 Création d’un modèle 3D en plomb avec sa pente, à partir de données de chemin SVG brutes.
  h3 Structure de données du chemin SVG
  p Voici une boîte contenant un "h" en Vulf Mono Light, une police de caractères par Oh No type company. Nous allons essayer de comprendre comment fonctionne cette liste d’instructions.
  <FoldablePre>
    pre
      | &lt;path style="stroke:#130000;stroke-opacity:1;stroke-width:4.42498882;stroke-miterlimit:4;stroke-dasharray:none;paint-order:markers stroke fill;fill:#ff0000;fill-opacity:1"
      | d="m 205.47289,169.14572 c -1.08,0 -1.56,-0.6 -1.56,-1.64 0,-3.4 4.68,-7.48 4.68,-12.04 0,-3 -1.88,-4.52 -4.84,-4.52 -3.52,0 -6.96,1.48 -10.4,7.2 h -0.56 c 2.08,-4.8 3.48,-8.48 3.48,-11.48 0,-2.24 -1.28,-3.36 -3.52,-3.36 -1.52,0 -3.12,0.44 -4.8,1.12 0.36,0.68 0.64,1.44 0.84,2.08 1.48,-0.68 2.48,-1.04 3.64,-1.04 1.28,0 1.84,0.6 1.84,1.76 0,2.92 -3.32,10.88 -8,23.16 0.8,0.12 1.44,0.24 2,0.48 l 0.12,0.04 c 5.68,-15.48 11.24,-18 14.92,-18 1.88,0 3.04,0.8 3.04,2.72 0,3.52 -4.68,7.64 -4.68,11.96 0,2.44 1.64,3.52 3.48,3.52 2.48,0 4.04,-1.56 6.08,-4.2 -0.72,-0.48 -1.12,-0.8 -1.68,-1.28 -1.4,2.28 -2.52,3.52 -4.08,3.52 z"
      | id="path1702" /&gt;
  </FoldablePre>
  p Selon <a href="http://svgpocketguide.com/book/#section-2">le SVG Pocket Guide</a>, l’attribut "d" contient des instructions représentées par des mnémoniques. Nous garderons également la spécification SVG Stroke ouverte dans un onglet, car une implémentation d’un algorithme de contour y est décrite. <a href="https://www.w3.org/TR/svg-strokes/#SpecifyingStrokePaint">W3 SVG spec</a>

  table(class="table striped")
    thead
      th mnemonic
      th meaning
      th observations
    tbody
      tr
        td m ou M
        td se déplacer
        td similaire à un levé de stylo. un chemin doit commencer par une commande M.
      tr
        td z ou Z
        td fermer le chemin
        td ferme le sous-chemin courant. trace une ligne droite entre ce point et le point initial du sous-chemin. Si une instruction M suit, le sous-chemin suivant commence à la coordonnée nouvellement définie. Sinon, le sous-chemin suivant commence au même point.
      tr
        td L ou l
        td dessin
        td trace une ligne entre le point courant et le point suivant. Le nouveau point devient le point courant. <strong>L</strong> signifie que les positions suivantes sont absolues, <strong>l</strong> signifie relatives.
      tr
        td H ou h
        td dessin d'une ligne horizontale
        td À l’instar de L et l,  H et h dénotent un positionnement absolu et relatif.
      tr
        td V ou v
        td dessin d'une ligne verticale
        td Comme L et l, et H et h, V et v indiquent un positionnement absolu et relatif.
      tr
        td C ou c
        td Tracer une courbe de Bézier
        td Tracer une courbe à partir du point courant, en utilisant (x1,y1) comme premier point de contrôle, et (x2, y2) comme second point de contrôle. La même correspondance majuscule/minuscule à absolue/relatif s'applique.
      tr
        td S ou s
        td Dessiner une courbe de Bézier, avec réflexion
        td Tracer une courbe suivant une instruction C, mais avec des points de contrôle en miroir.
      tr
        td Q ou q
        td Tracer une courbe de Bézier quadratique
        td Les courbes quadratiques de Bézier ont un tenseur unique (x1, y1).
      tr
        td T ou t
        td Tracer une courbe de Bézier quadratique
        td Comme S et s pour une courbe de Bézier cubique, T et t sont les instructions de dessin en miroir pour une courbe de Bézier quadratique.
      tr
        td A ou a
        td Dessiner un segment d’ellipse.
        td Une instruction A dessine un segment d’une ellipse, avec un point de départ, un point de fin, un rayon x, un rayon y, la rotation de l’ellipse et sa direction. Deux autres paramètres, large-arc et sweep, sont des drapeaux donnant des directives sur la partie de l’ellipse devant être dessinée.

  figure
    img(src="../../pictures/man_1.jpg")
    img(src="../../pictures/man_3.jpg")
    img(src="../../pictures/man_2.jpg")
    span.author premières esquisses du processus tel que je l’imaginais
  p Avec ces éléments en tête, nous pouvons déchiffrer le chemin svg vu plus haut, et l’annoter :
  <FoldablePre>
    pre
      | m 205.47289,169.14572 // Move to (205.47289, 169.14572)  
      | c -1.08,0 -1.56,-0.6 -1.56,-1.64 // Cubic Bézier (relative, from last point, first tensor at (-1.08, 0), second tensor at (-1.56, -0.9), end point at (-1.56, -1.64))
  </FoldablePre>
  h3 Une notation plus claire pour ces recherches
  p Cette notation est un peu difficile à lire, on introduit des "fonctions" qui renvoient le point courant. Les points seront une sorte de tuple (x, y).
  <FoldablePre>
    pre
      | m 205.47289,169.14572 // move((205.47289, 169.14572))
      | c -1.08,0 -1.56,-0.6 -1.56,-1.64 // cubicRel(lp, (-1.08,0), (-1.56,-0.6), (-1.56,-1.64))
  </FoldablePre>
  p Nous pouvons voir un modèle émerger : une dépendance à un état global de "point courant". On pourrait aussi penser cela de façon plus fonctionnelle :
  <FoldablePre>
    pre
      | m 205.47289,169.14572 // move((205.47289, 169.14572)) -> returns ((205.47289, 169.14572))
  </FoldablePre>
  p Le dernier échantillon avec deux instructions devient :
  <FoldablePre>
    pre
      | cubicRel(move((205.47289, 169.14572)), (-1.08,0), (-1.56,-0.6), (-1.56,-1.64))
  </FoldablePre>
  p Si on ajoute l’instruction suivante du chemin original, une autre courbe cubique de Bézier, notre chemin ressemble maintenant à :
  <FoldablePre>
    pre
      | cubicRel(
      |   cubicRel(
      |     move((205.47289, 169.14572)),
      |     (-1.08,0), (-1.56,-0.6), (-1.56,-1.64))
      |    , (0,-3.4), (4.68,-7.48), (4.68,-12.04))
  </FoldablePre>
  p On pourrait aussi produire une liste d’instructions séparées prenant le dernier point comme argument, et réévaluant tous les résultats vers des coordonnées absolues.
  <FoldablePre>
    pre
      |  move((205.47289, 169.14572)) // -&gt; (205.47289, 169.14572)
      |  cubicRel((205.47289, 169.14572),
      |  (204,39289, 169.14572),
      |  (203,91289, 168,54572),
      |  (203,91289, 167,50572)) // -&gt; (203,91289, 167,50572)
  </FoldablePre>
  p Cela semble assez facile à générer ! Écrivons le minimum de code pour parser ces deux déclarations vers un AST, et produisons ce genre de liste de pseudo-instructions. Je vais écrire cela en JS pour obtenir des exemples tournant dans le navigateur.
  h3 Parsing des données de chemin SVG vers un AST avec une grammaire réduite
  p Commençons par rédiger une grammaire qui permet à ces deux instructions d'exister.
  ul
    li un <em>chemin</em> est constitué d'<em>instructions</em>.
    li <em>instruction</em> peut être <em>déplacement</em> ou <em>cubique</em>.
    li <em>instruction</em> prend un certain nombre de <em>points</em>.
    li un <em>point</em> est composé de deux <em>nombres</em> séparés par une virgule entre parenthèses.
    li un <em>nombre</em> est un trait d’union facultatif, suivi de plusieurs <em>chiffres</em>, d’un point facultatif et peut-être de plusieurs <em>chiffres</em> à nouveau
    li enfin, un <em>chiffre</em> est un caractère dans la liste [0 1 2 3 4 5 6 7 8 9]
  <FoldablePre>
    pre
      | path = instructions*
      | instruction = move point | cubic point point point point
      | point = '('number','number')'
      | number = '-'?digit+'.'?digit+
      | digit = [0-9]
  </FoldablePre>
  p Cela suffit pour écrire un parseur basique qui comprend les instructions <em>move</em> et <em>cubic</em> autonomes.
  <ParserFirstStep/>
  p Cet exemple utilise l’implémentation JS suivante : nous avons une regex pour identifier les points et définir les regexes pour les instructions de déplacement et de courbes de bézier cubiques. Nous ne tokenizons l’entrée qu’en coupant sur les retours à la ligne et en filtrant les lignes vides.
  <FoldablePre>
  pre
    | const Point = function(x, y) { this.x = x; this.y = y; };
    | const pointR = '(?:([-]*\\d+\\.?(?:\\d+)?),([-]*\\d+\\.?(?:\\d+)?))';
    |
    | const moveRegex = new RegExp(`m\\s*${pointR}`, 'i');
    | const cubicRegex = new RegExp(`c\\s*${pointR}\\s${pointR}\\s${pointR}`, 'i');
    |
    | const matchesToPoints = (token, matches) =&gt; {
    |   if (!matches) throw new Error(`Couldn't parse token ${token}`);
    |   const points = matches.slice(1);
    |   if (points.length % 2 !== 0) throw new Error(`Instruction contains an uneven number of coordinates.`);
    |   const out = [];
    |   for (let i = 0; i &lt; points.length; i += 2) {
    |     out.push(new Point(points[i], points[i + 1]));
    |   }
    |   return out;
    | };
    |
    | const move = token =&gt; matchesToPoints(token, token.match(moveRegex));
    | const cubic = token =&gt; matchesToPoints(token, token.match(cubicRegex));
    |
    | const lex = (tokens) =&gt; {
    |   return tokens.map(t =&gt; {
    |     switch (t.charAt(0).toLowerCase()) {
    |       case "m":
    |         return {type: 'Move', params: move(t) };
    |       break;
    |       case "c":
    |         return {type: 'Cubic', params: cubic(t) };
    |       break;
    |       default:
    |         return;
    |       break;
    |     }
    |   });
    | };
    |
    | const tokenize = text =&gt; text.split('\n').map(a =&gt; a.trim()).filter(a =&gt; a);
    | export const parse = text =&gt; lex(tokenize(text));
  </FoldablePre>

  h3 Parsing realistic input
  p Still, we're assuming many things here. We need a list of newline-separated instructions, starting with their mnemonic.
    | The input format is a list of instructions, without newlines, and mnemonics are only present at an instruction change.
    | That means <code>m point \n c point point point \n c point point point</code> won't ever be present.
    | We need a way to keep track of the current type of instruction, and take points accordingly.
    | <br/>Let's do this !
  <ParserSecondStep client:visible/>

  h3 Rendering to a list of expressions &amp; a canvas
  p Well, it seems to work for those two instructions ! The current point is carried on, and we have independent instructions that are sufficient to render something.
  p We can try to render it to a list of expressions, akin to an example shown higher, then to a canvas.
  <ParserThirdStep client:visible/>

  h3 Adding H,h, L,l, and V,v instructions
  p Nice ! We're now able to transform raw SVG path data to an abstract syntax tree, and transform it back to a list of absolute-positioned subpaths, or draw it to a canvas. But many instructions are missing, and the examples to this point just silence errors.
  p Let's implement h, l, and v instructions. H and V are just special cases of L where the current point Y or X coordinate is carried on.
  <ParserFourthStep client:visible/>

  h3 Converting curves to segments
  p Our next step is a conversion from curves to only-segments path data.
  <ParserFifthStep client:visible/>

  h3 Transforming our original path to an offset reflection
  p I'm not sure how to proceed for this one, but : for three points (or vector) a, b, and c, the point b' will be equal to the vector b added to the vector going from the middle of the segment <em>ac</em> to b.<br/>
    | Let's draw points instead of lines now, by writing a converter from instructions to points. A brute version would be to reduce instruction points to a list, then deduplicate adjacent items.
  p Meaning : move([1,0]), line([1,0] [5,0]), line([5, 0] [7,2]) becomes [1,0],[1,0],[5,0],[5,0],[7,2] then [1,0],[5,0],[7,2].

  figure
    img(src="../../pictures/m_1.jpg")
    img(src="../../pictures/m_2.jpg")
    span.author Drawings made by Laura Savignac to help me find a method

  p We now have points instead of curves, and a method, we'll proceed to do this scale-up algorithm. Or will we ?

  <ParserSixthStep/>

  p
    | It happens that the problem I'm trying to solve is really non-trivial. With a bit more research (and stumbling on the right terms), what I'm trying to solve is called "outward polygon offsetting".
    | <a href="https://stackoverflow.com/questions/1109536/an-algorithm-for-inflating-deflating-offsetting-buffering-polygons">A stackoverflow answer</a> gave me some direction. <a href="http://fcacciola.50webs.com/Offseting%20Methods.htm">This survey gave a nice answer too.</a>
    | What if a simpler strategy could work ? I could reimplement a C++/C#/Delphi library called <a href="http://www.angusj.com/delphi/clipper.php">Clipper</a>, or find a "nice enough" heuristic.
    | I could copy-paste a stroke algorithm and take its output before rendering. Let's dive into Inkscape sources. Or into Clipper, and extract the subroutine and its dependencies.
  p For now, let's test with a library found on npm, <a href="https://github.com/w8r/polygon-offset">polygon-offset</a>. It seems nice enough to be free of assumptions about how you describe a polygon, and is satisfied with an array of points.
  <ParserSeventhStep/>
  p We have an offset outline, and implementing this by hand would have been a nightmare. Can we make this 3d ? I'll take <a href="https://threejs.org/examples/?q=conv#webgl_geometry_convex">This example from three.js</a> as a starting point. What was meant to be an "implement everything" exercise turns more and more to a "cobble stuff together" exercise. But I now have a nice stack of papers to read. Clicking "download" on three.js homepage yields a 250MB zip file, I should have known what territory I was stepping into.
  figure
    img(src="../../pictures/threejsconvex.jpg")
    span.author Three.js's example adapted with current path &amp; offset data.
  p This test, an adaptation of THREE.js's example "ConvexGeometry", reveals that a naïve culling approach won't be enough: our polygons are concave.
  p Let's dive into <a href="https://en.wikipedia.org/wiki/Polygon_triangulation">polygon triangulation</a>, I guess ? There are naïve algorithms available, and I'll then proceed to implement stitching between the original and offset shape.
  figure
    img(src="../../pictures/openscad.jpg")
    span.author An adaptation of a script found on the OPENSCAD forums. I can't find the link back, email me if you're the author !
    img(src="../../pictures/h_svg.jpg")
    span.author my starting point
    img(src="../../pictures/svg_3.jpg")
    span.author I should have known before starting, with those manual tests, that my naïve approach wasn't going to cut it.
</template>

<script lang="ts">
import ParserFirstStep from './live/ParserFirstStep.vue';
import ParserSecondStep from './live/ParserSecondStep.vue';
import ParserThirdStep from './live/ParserThirdStep.vue';
import ParserFourthStep from './live/ParserFourthStep.vue';
import ParserFifthStep from './live/ParserFifthStep.vue';
import ParserSixthStep from './live/ParserSixthStep.vue';
import ParserSeventhStep from './live/ParserSeventhStep.vue';
import FoldablePre from './FoldablePre.vue';

export default {
  name: 'Programmatically',
  components: {
    ParserFirstStep,
    ParserSecondStep,
    ParserThirdStep,
    ParserFourthStep,
    ParserFifthStep,
    ParserSixthStep,
    ParserSeventhStep,
    FoldablePre,
  },
};
</script>