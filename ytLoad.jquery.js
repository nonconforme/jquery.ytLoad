(function ( $ ) {
    var PLUGIN_IDENTIFIER = 'ytLoad';
    var settings;
    var ajaxError;

    var methods = {
        init: function(options) {
            ajaxError = false;

            settings = $.extend({
                registerAjaxHandlers: true,
                startPercentage: 30,
                startDuration: 200,
                completeDuration: 50,
                fadeDelay: 200,
                fadeDuration: 200,
                progressBarId: PLUGIN_IDENTIFIER,
                onStart: function() { },
                onComplete: function() { },
                onError: function() { }
            }, options);

            if(settings.registerAjaxHandlers) {
                $(document).on('ajaxStart.'+PLUGIN_IDENTIFIER, function() {
                    methods.start();
                });

                $(document).on('ajaxComplete.'+PLUGIN_IDENTIFIER, function() {
                    if($.active < 2) {
                        methods.complete();
                    }
                });

                $(document).on('ajaxError.'+PLUGIN_IDENTIFIER, function() {
                    methods.error();
                });
            }
        },

        start: function() {
            $progressBar = $('#'+settings.progressBarId);
            ajaxError = false;

            if ($progressBar.length == 0) {
                $('body').append('<div id="'+settings.progressBarId+'" class="'+settings.progressBarId+'"><dt></dt><dd></dd></div>');
                $progressBar = $('#'+settings.progressBarId);
            }

            $progressBar.transit({
                width: settings.startPercentage+'%'
            }, settings.startDuration);

            settings.onStart();
        },

        complete: function() {
            $progressBar.transit({
                width: '101%',
                complete: function() {
                    if(ajaxError) {
                        methods.error();
                    }
                    $progressBar.delay(settings.fadeDelay);
                    $progressBar.fadeOut({
                        duration: settings.fadeDuration,
                        complete: function() {
                            settings.onComplete();
                            $progressBar.remove();
                        }
                    });
                }
            }, settings.completeDuration);
        },

        error: function() {
            $progressBar = $('#'+settings.progressBarId);
            $progressBar.addClass('error');

            settings.onError();
        },

        destroy: function() {
            if(settings.registerAjaxHandlers) {
                $(document).off('ajaxStart.'+PLUGIN_IDENTIFIER);
                $(document).off('ajaxComplete.'+PLUGIN_IDENTIFIER);
                $(document).off('ajaxError.'+PLUGIN_IDENTIFIER);
            }
        }
    };

    $.ytLoad = function(methodOrOptions) {
        if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.'+PLUGIN_IDENTIFIER );
        }
    };
}( jQuery ));