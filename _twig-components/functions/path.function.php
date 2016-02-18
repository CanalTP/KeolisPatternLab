<?php

$function = new Twig_SimpleFunction('path', function ($route) {
    return '/patterns/04-pages-'.$route.'/04-pages-'.$route.'.html';
});