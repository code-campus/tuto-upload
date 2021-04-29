(function ($) {
    "use strict";

    $.fn.collection = function (options) {

        var settings = $.extend(true, {
            beforeAddItem: function(collection, item, counter){
                return item;
            },
            afterAddItem: function(collection, item, counter){
                return true;
            },
            beforeRemoveItem: function(collection, item, counter){
                return item;
            },
            afterRemoveItem: function(collection, item, counter){
                return true;
            }
        }, options);
        
        $(this).each((index, collection) => {

            let items = $(collection).children().length;
            let min = get_widgetInit($(collection));

            if (min > items) 
            {
                min-= items;

                for (let i=0; i<min; i++)
                {
                    action_addItem($(collection))
                }
            }
            
            refresh_serial($(collection));
        });

        get_actions();

        function action_addItem(collection)
        {
            let counter = get_counter(collection);
            let wrapper = get_widgetTag(collection);
            let prototype = get_prototype(collection);
                prototype = prototype.replace(/__name__/g, counter);
                
            let newItem = $(wrapper).html(prototype);
                // newItem = settings.beforeAddItem(collection, newItem, counter);
                newItem.appendTo(collection);
    
            settings.afterAddItem(collection, newItem, counter);

            counter_increment(collection, counter);
            refresh_serial(collection);
            get_actions();
        }

        function action_removeItem(collection, element)
        {
            let items = collection.children();
            let item = element.data('collection-item');
            let min = get_widgetMin(collection);

            if (items.length > min)
            {
                items.map(function(index, value) {
    
                    if (item == index)
                    {
                        $(value).remove();
                    }
                    
                });

                refresh_serial(collection);
            }
        }


        function refresh_serial($c)
        {
            let id = get_id($c);
            let items = $c.children();
            let min = get_widgetMin($c);

            // Refresh Serial
            $c.find('[data-collection-serial]').each((serial, element) => {
                serial++;
                $(element).html(serial);
            });

            // Refresh Serial of Delete button
            $c.find('[data-collection-serial0]').each((serial, element) => {
                $(element).data('collection-item', serial);
            });

            $('[data-collection-action]').each(function(){
                if ($(this).data('collection-action') == "remove" && items.length <= min)
                {
                    $(this).attr('disabled', true);
                }
                else
                {
                    $(this).attr('disabled', false);
                }
            });
        }

        function counter_increment($c, counter)
        {
            counter++;
            $c.data('widget-counter', counter);
        }


        function get_actions()
        {
            $('[data-collection-action]').on('click', function(e) {

                e.stopImmediatePropagation();
                e.preventDefault();

                let element = $(e.target);
                let action = $(e.target).data('collection-action');
                let collection = $($(e.target).data('collection-target'));
    
                eval('action_'+action+'Item')(collection, element);
            });
        }

        function get_counter($c) 
        {
            return $c.data('widget-counter') || $c.children().length;
        }

        function get_id($c) 
        {
            return $c.attr('id');
        }

        function get_widgetTag($c)
        {
            return $c.attr('data-widget-tags');
        }

        function get_widgetMin($c)
        {
            return $c.attr('data-widget-min') || 0;
        }

        function get_widgetInit($c)
        {
            return $c.attr('data-widget-init') || 1;
        }

        function get_prototype($c)
        {
            let id = get_id($c);
            let prototype = $('[data-collection-prototype][data-collection-target="#'+id+'"]');

            if (prototype.length == 0)
            {
                console.warn("collection.js: Prototype is not found for the collection #"+id+".");
                return false;
            }
            
            return prototype.html();
        }

    };
})
(jQuery);