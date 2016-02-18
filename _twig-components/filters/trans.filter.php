<?php

use Symfony\Component\Yaml\Parser;

$filter = new Twig_SimpleFilter('trans', function($key, $domain = 'messages', $replacements = array(), $locale = 'fr') {

    $content = file_get_contents(__DIR__.'/../../translations/'.$domain.'.'.$locale.'.yml');
    $parser = new Parser();
    $translations = $parser->parse($content);

    $translation = $key;
    $parts = explode('.', $key);

    foreach ($parts as $index => $part) {
        if (!is_array($translations) || empty($translations[$part])) {
            break;
        }
        if ($index < count($parts)-1) {
            $translations = $translations[$part];
        } else {
            $translation = $translations[$part];
        }
    }

    return strtr($translation, $replacements);
});