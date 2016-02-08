Keolis Patternlab
========================

1) Verification des dependances
-------------------------------------

- [git][1]
- [npm][2]

2) Installation (dossier web: /var/www)
-------------------------------------
- cd /var/www
- git clone git@github.com:CanalTP/KeolisPatternLab.git KeolisPatternLab

3) Mise à jour des assets
-------------------------------------
- cd KeolisPatternLab
- compass compile
- npm install
- npm run grunt-browserify

[1]: http://git-scm.com
[2]: https://nodejs.org/en/download/package-manager/