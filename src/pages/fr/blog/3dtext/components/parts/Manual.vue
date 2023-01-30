<template lang="pug">
section
  h2 Une première tentative manuelle
  h3 À quoi ressemble un caractère en plomb ?
  p J’aimerais être capable d’être autonome sur la production de caractères et de formes en plomb.
  figure
    img(src="../../pictures/lead_type.jpg")
    span.author This image was originally posted to Flickr by quinet at https://flickr.com/photos/91994044@N00/25792503796.
  p A Toulouse, certains ateliers offrent leurs services d’usinage CNC et sont en mesure de produire des plaques d’aluminium à la bonne hauteur pour une presse typographique. Mais j’aimerais qu’une presse typographique devienne un outil d’expérimentation, plutôt qu’un outil final, caractérisé par le besoin d’être absolument certain d’une mise en page avant de l’envoyer à graver.
  p Une caractéristique distincte, mais cruciale des plaques d’aluminium gravées ou des caractères de plomb est que la forme à imprimer n’était pas simplement extrudé de son substrat. La forme émerge d’un pilier qui ressemble à un gonflement de son contour. Sur l'image ci-dessous, vous pouvez voir ce léger décalage. Cela confère sa résistance à l'usure au caractère.
  figure
    img(src="../../pictures/lead_type_2.jpg")
    span.author Free picture by https://fr.freeimages.com/photo/lead-type-1-1460305
  h3 Comment reproduire cette pente douce manuellement ?
  p Cette pente est assez fastidieuse à générer manuellement : je pars des données de chemins d’Inkscape ou Illustrator, je les importe dans Blender, les extrude, les décale avec l'outil Offset Scale (Alt + S), les exporte dans un fichier STL, les nettoie dans Netfabb, puis les tranche dans Cura.
  figure
    img(src="../../pictures/letter_h_svg.jpg")
    span.author "h" bold italic in Input from FontBureau, in Inkscape
    img(src="../../pictures/letter_h_blender.jpg")
    span.author after an import and offset extrusion in Blender
    img(src="../../pictures/letter_h_netfabb.jpg")
    span.author then imported into Netfabb
    img(src="../../pictures/letter_h_cura.jpg")
    span.author and finally sliced in Cura
  p Ce processus est fastidieux. Je pensais pouvoir l’automatiser, à partir des données de chemin SVG. Le reste de cet article montre que c’était beaucoup plus complexe que je ne le pensais, et, après quelques jours d’exploration, il est évident que j’aurais du penser aux chemins qui se croisent, aux chemins avec des trous, aux formes concaves, et bien d'autres pièges encore.
  figure
    img(src="../../pictures/u_3d.jpg")
    img(src="../../pictures/u_3d_print.jpg")
</template>

<script lang="ts">
  export default {
    name: 'Manual',
  };
</script>

<style>
  
</style>