<?php

require_once __DIR__ . '/init.php';
require_once LB_LIB . 'ElementProvider.php';
require_once LB_LIB . 'RouteHandler.php';

$elementProvider = new LayoutBuilder\ElementProvider();

/**
 * Register some example elements.
 */
$elementProvider->register('lorem', function() {
	return '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque rutrum massa sit amet mi volutpat eleifend. Fusce egestas enim sit amet magna feugiat ultrices. In scelerisque magna risus, ac vehicula erat pellentesque in. Aenean vel purus ut dolor vestibulum semper quis ac augue.</p>';
});

$elementProvider->register('html', function($values) {
	return '<div>' .
		(isset($values->html) ? $values->html : 'No HTML provided!') .
	'</div>';
}, array(
	'label' => 'HTML',
	'fields' => array(
		array(
			'label' => 'HTML',
			'code' => 'html',
			'type' => 'wysiwyg',
			'options' =>  array(
				'toolbar' => 'minimal', //minimal, basic, full
				//"language" => 'es',
				//"uiColor" => '#F7B42C',
				//"height" => 200,
				//"toolbarCanCollapse" => true
    		)
		),
		array(
			'label' => 'JavaScript',
			'code' => 'js',
			'type' => 'textarea'
		),
		array(
			'label' => 'CSS',
			'code' => 'css',
			'type' => 'textarea'
		)
	)
));

$elementProvider->register('image', function($values) {
	return '<img' .
		' src="' . (isset($values->src) ? $values->src : '') . '"' .
		' alt="' . (isset($values->alt) ? $values->alt : '') . '"' .
		' title="' . (isset($values->title) ? $values->title : '') . '"' .
		'/>';
}, array(
	'label' => 'Image',
	'fields' => array(
		array(
			'label' => 'Source',
			'code' => 'src',
			'type' => 'image'
		),
		array(
			'label' => 'Alt',
			'code' => 'alt',
			'type' => 'text'
		),
		array(
			'label' => 'Title',
			'code' => 'title',
			'type' => 'text'
		)
	)
));

$elementProvider->register('list', function($values) {
	$listElem = isset($values->type) && $values->type === 'ordered' ? 'ol' : 'ul';
	$html = '<' . $listElem . '>';
	if (isset($values->items) && is_array($values->items))
	{
		foreach ($values->items as $item)
		{
			$html .= '<li>' . $item->text . '</li>';
		}
	}
	$html .= '</' . $listElem . '>';
	return $html;
}, array(
	'label' => 'List',
	'fields' => array(
		array(
			'label' => 'Type',
			'code' => 'type',
			'type' => 'select',
			'chosen' => false,
			'multiple' => false,
			'options' => array(
				array(
					'label' => 'Ordered',
					'value' => 'ordered'
				),
				array(
					'label' => 'Unordered',
					'value' => 'unordered'
				)
			),
			'default' => 'ordered'
		),
		array(
			'label' => 'Items',
			'code' => 'items',
			'type' => 'list',
			'list' => array(
				array(
					'label' => 'Text',
					'code' => 'text',
					'type' => 'text'
				)
			)
		)
	)
));

return $elementProvider;
