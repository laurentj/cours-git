/**
 * Author: Laurent Jouanneau  (laurent@jelix.org)
 * Licence: MIT
 * version: 0.3
 */
(function ($) {

    function resizeModal (jqElt, elt) {

        var m = $(elt.mask);
        var win = $(window);
        var winH = win.height();
        var winW = win.width();
        var maskHeight = $(document).height();
        var maskWidth = winW;
        if (winW < $(document).width()) {
            maskWidth = $(document).width();
        }

        m.css({'width':maskWidth,'height':maskHeight});
        m.show();

        if (elt.boxoptions.top == 'middle')
            jqElt.css('top',  winH/2 - jqElt.outerHeight()/2 + win.scrollTop());
        else
            jqElt.css('top',  elt.boxoptions.top + win.scrollTop());

        if (elt.boxoptions.left == 'middle')
            jqElt.css('left', winW/2 - jqElt.outerWidth()/2 + win.scrollLeft());
        else
            jqElt.css('left',  elt.boxoptions.left + win.scrollLeft());
    }


    /**
     * options: an object containing:
     *      onbeforeshow: a function called before the display of the dialog box
     *                     and after the display of the mask
     *                     argument: the jquery object
     *      onshow: a function called after the display of the box
     *              argument: the jquery object
     *      onconfirm: a function called when the dialog is closed.
     *          should return true if the dialog can be close
     *          parameters of the function: the options
     *      any other properties needed by your onconfirm function
     */
    jQuery.fn.showModal = function (options) {
        var elt = this.get(0);
        if (!elt)
            return null;

        elt.boxoptions = jQuery.extend({
            top:'middle',
            left:'middle'
        }, options);

        elt.mask = document.createElement('div');
        elt.mask.setAttribute('class', 'modalmask');
        elt.mask.oldresize = window.onresize;

        var jqElt = this;
        window.onresize = function(event) {
            resizeModal(jqElt, elt);
        }

        document.body.appendChild(elt.mask);

        resizeModal(this, elt);

        if (options.onbeforeshow)
            options.onbeforeshow(this);

        this.show();
        if (options.onshow)
            options.onshow(this);

        return this;
    };

    jQuery.fn.hideModal = function () {
        var elt = this.get(0);
        if (elt.mask) {
            window.onresize = elt.mask.oldresize;
            $(elt.mask).hide();
            document.body.removeChild(elt.mask);
            elt.mask = null;
        }
        if (elt.boxoptions)
            elt.boxoptions = null;
        this.hide();
        return this;
    };

    jQuery.fn.closeConfirmModal = function () {
        var elt = this.get(0);
        if (elt.boxoptions && elt.boxoptions.onconfirm) {
            if (!elt.boxoptions.onconfirm(elt.boxoptions))
                return this;
        }
        this.hideModal();
        return this;
    };

}(jQuery));
