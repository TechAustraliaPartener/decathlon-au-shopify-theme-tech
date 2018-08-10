'use strict';

$(function() {

    function bundleize() {
        if(typeof bundles !== 'undefined') {
            $('.addToCartForm').each(function() {
                var $form = $(this);
                var addons_titles = [];
                var addons = [];

                // Look for addons on the product level
                if ($form.find('[name=p_handle]').length
                        && typeof bundles.products[$form.find('[name=p_handle]').val()] !== 'undefined') {

                    addons = bundles.products[$form.find('[name=p_handle]').val()];
                }

                // If not look for all addons at the collection level
                if (!addons.length && $form.find('[name=collections]').length) {
                    var collections = $form.find('[name=collections]').val().split(',');

                    $.each(collections, function(i, collection) {
                        if(typeof bundles.collections[this] !== 'undefined') {
                            addons.push.apply(addons, bundles.collections[this]);
                        }
                    });
                }

                // If there are addons, bundleize
                if (addons.length) {
                    $.each(addons, function(j, addon) {
                        $form.append('<input type="hidden" name="id[]" value="' + addon.variants[0].id + '" />');
                        $form.append('<input type="hidden" name="properties[_for]" value="' + $form.find('[name=id]').val() + '" />');
                        addons_titles.push(addon.title);
                    });

                    // $form.css('outline', 'dotted 5px red');
                    $form.find('[name=id]').attr('name', 'id[]').after('<input type="hidden" name="properties[_for]" value="" />');

                    if ( $('body.template-product').length ) {
                        $('.addons-list__items').text(addons_titles.join(', '));
                        $('.addons-list').show();
                    } else {
                        $form.find('.addons-list__items').text(addons_titles.join(', '));
                        $form.find('.addons-list').show();
                    }
                }

                // Garbage collection
                $form.find('[name=collections], [name=p_handle]').remove();
            });
        }
    }

    window.bundleize = bundleize;
    bundleize();

    $(document).on('change', '[name="updates[]"][data-addons]', function() {
        var addons = $(this).data('addons').split(',');
        var val = $(this).val();

        $.each(addons, function(i, addon) {
            $('#updates_' + addon).val(val);
            $('#updates_' + addon + '__display').text(val);
        })
    });


});
