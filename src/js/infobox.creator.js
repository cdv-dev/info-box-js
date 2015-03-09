
/**
 * Module for creating Info-Box
 */
var infoBox = (function () {

    var iProductIndex = 0,
        boxSettings = null,
        elements = {
            idProductPromo : "product-promo",
            idProductHeader : "product-header",
            idProductBody : "product-body",
            idProductBodyMain : "product-body-main",
            idProductBodySub : "product-body-sub",
            idProductDetails : "product-details",
            idDetailsLabel : "details-label",
            idStoreLink : "store-link"
        },
        lres = {
            btnPrev : "Prev",
            btnNext : "Next",
            btnFind : "Store",
            lnkDetailsShow : "show details",
            lnkDetailsHide : "hide details"
        };



    var InfoBoxSettings = function () {
        //path to skin css file
        var skinCssPath = "src/css/box.skin.css";
        //path to product details file
        var productDetailsPath = "src/info_box.json";
        //path to images
        var imagesPath = "src/img";

        this.setSkinCssPath = function(strPath){
            if (strPath !== undefined && strPath !== "") {
                skinCssPath = strPath;
            }
        };

        this.setProductDetailsPath = function(strPath){
            if (strPath !== undefined && strPath !== "") {
                productDetailsPath = strPath;
            }
        };

        this.setImagesPath = function(strPath) {
            if (strPath !== undefined && strPath !== "") {
                imagesPath = strPath;
            }
        };

        this.getSkinCssPath = function() {
            return skinCssPath;
        };

        this.getProductDetailPath = function() {
            return productDetailsPath;
        };

        this.getImagesPath = function() {
            return imagesPath;
        };

    };

    var isJQuery = function() {
        var isJQ = true;
        try {
            jQuery()
        } catch (e) {
            if (e.message != null)
                isJQ = false
        }
        return isJQ
    };

    var getJsonData = function(url){
        var oRequest, strResp = "", arr = [];

        try {
            oRequest = new ActiveXObject("Msxml2.XMLHTTP")
        } catch (e) {
            try {
                oRequest = new ActiveXObject("Microsoft.XMLHTTP")
            } catch (E) {
                oRequest = false
            }
        }

        if (!oRequest && typeof XMLHttpRequest != "undefined") {
            oRequest = new XMLHttpRequest;
        }

        oRequest.onreadystatechange = function () {
            if (oRequest.readyState == 4 && oRequest.status == 200) {
                strResp = oRequest.responseText;
            }
        };
        oRequest.open("GET", url, false);
        oRequest.send();

        if (strResp !== "") {
            try {
                arr = JSON.parse(strResp);
            } catch (e) {
                //JSON don`t working in IE < 8
                //eval is evil, can be use json2.js
                arr = eval(strResp);
            }
        }

        return arr;
    };

    var getPromoBg = function(){
        //IE don`t understand location.origin
        if (!location.origin) {
            location.origin = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
        }
        return "url(" + location.origin + location.pathname.replace(/[\/][a-zA-Z0-9]+[.][a-zA-Z#?_-]+/g, "") + "/" + boxSettings.getImagesPath() + "/" + boxSettings.jsonData[iProductIndex].img + ")"
    };


    /**
     * Method for creating event
     * @param oElm - element object
     * @param type - event type (click, keydown  etc.)
     * @param func - callback function
     */
    var addEvent = function(oElm, type, func){
            try {
                if (oElm.addEventListener) {
                    oElm.addEventListener(type, func, false);
                } else if (oElm.attachEvent) {
                    oElm.attachEvent("on" + type, func);
                } else {
                    oElm["on" + type] = func;
                }
            } catch (e) {
            }
    };

    /**
     * Event handler for link "show details"
     */
    var detailsShowHide = function() {
        var oPromo = document.getElementById(elements.idProductPromo),
            oProductBody = document.getElementById(elements.idProductBody),
            oDetails = document.getElementById(elements.idProductDetails),
            oDetailLabel = document.getElementById(elements.idDetailsLabel),
            iAnimateTime = 500;

        if (oPromo == null || oProductBody == null) {
            return;
        }
        var promoVisible = (oPromo.style.display !== "none");

        if (oDetails !== null) {
            oDetails.style.top = oDetails.offsetTop + "px";
            oDetails.style.position =  "absolute";
        }

        if (isJQuery()) {

            if (promoVisible) {
                $(oPromo).slideUp(iAnimateTime, function () {
                    $(oProductBody).animate({height: "100%"}, iAnimateTime);
                    $(oDetailLabel).html("hide details");
                });
            } else {
                $(oProductBody).animate({height: "2em"}, iAnimateTime);
                $(oPromo).slideDown(iAnimateTime, function(){
                    $(oDetailLabel).html(lres.lnkDetailsShow);
                });

            }

        } else {
            oPromo.style.display = promoVisible ? "none" : "block";
            oProductBody.style.height = promoVisible ? "100%" : "";
            oDetailLabel.innerHTML = promoVisible ? lres.lnkDetailsHide : lres.lnkDetailsShow;
        }

    };

    var changeProduct = function(index) {
        var oProductPromo = document.getElementById(elements.idProductPromo),
            oProductHeader = document.getElementById(elements.idProductHeader),
            oProductBodyMain = document.getElementById(elements.idProductBodyMain),
            oProductBodySub = document.getElementById(elements.idProductBodySub),
            oStoreLink = document.getElementById(elements.idStoreLink),
            json = boxSettings.jsonData,
            iAnimateTime = 200;

        oProductHeader.innerHTML = "";
        oProductBodyMain.innerHTML = "";
        oProductBodySub.innerHTML = "";

        if (isJQuery()) {
            $(oProductPromo).parent().animate({opacity : 0}, iAnimateTime, function(){
                oProductPromo.style.backgroundImage = getPromoBg();
                oProductHeader.innerHTML = json[index].title;
                oProductBodyMain.innerHTML = json[index].description;
                oProductBodySub.innerHTML = json[index].note;
            });
        } else {
            oProductPromo.style.backgroundImage = getPromoBg();
            oProductHeader.innerHTML = json[index].title;
            oProductBodyMain.innerHTML = json[index].description;
            oProductBodySub.innerHTML = json[index].note;
        }

        if (isJQuery()) {
            $(oProductPromo).parent().animate({opacity : 1}, iAnimateTime);
        }

        oStoreLink.href = json[index].productUrl;

    };

    /**
     *  Event handler for button "Prev"
     */
    var prevProduct = function(){
        var iProducts = boxSettings.jsonData.length;
        if (iProducts > 0) {
            if (iProductIndex == 0) {
                iProductIndex = iProducts - 1;
            } else {
                iProductIndex--;
            }

            changeProduct(iProductIndex);
        }
    };

    /**
     *  Event handler for button "Next"
     */
    var nextProduct = function(event){

       var iProducts = boxSettings.jsonData.length;

       if (iProducts > 0) {

           if ( iProductIndex >= (iProducts - 1) ) {
                iProductIndex = 0;
           } else {
                iProductIndex++;
           }

           changeProduct(iProductIndex);
       }
    };

    /**
     *  Event handler for button "Store"
     */
    var findProductStore = function(event){
        //empty
    };

    /**
     * Method for creating main styles
     */
    var createStyle = function(oSettings){
        var oHead = document.getElementsByTagName("head")[0],
            oStyles = oHead.getElementsByTagName("style"),
            bStyle = false;

        //skin styles
        var oLink = document.createElement("link");
        oLink.rel = "stylesheet";
        oLink.href = oSettings.getSkinCssPath();
        oHead.appendChild(oLink);

        //check that styles is already available
        for (var i = 0, j = oStyles.length; i < j; i++) {
            var id = oStyles[i].id;
            if (id !== null) {
                if (id === "info-box") {
                    bStyle = true;
                }
            }
        }

        if (bStyle) {
            return;
        }

        //creating styles
        var styles = document.createElement("style");
        styles.type = "text/css";
        styles.id = "info-box";

        var cssRules = ".box {" +
                              "display: inline-block;" +
                              "position: relative;" +
                             "}" +

                        ".box .content {" +
                                        "min-height: 100%;" +
                                        "_height: 100%;" +
                        "}" +

                        ".box .product-promo {" +
                                              "width: 100%;" +
                                              "height: 200px;" +
                                              "background-repeat: no-repeat;" +
                                              "background-position: 40% 50%;" +
                                             "}" +

                        ".box .product-header {" +
                                               "padding: 5px 10px;" +
                        "}" +

                        ".box .product-body {" +
                                             "padding: 0 10px;" +
                                             "overflow: hidden;" +
                                             "text-overflow: ellipsis;" +
                                             "height: 2em;" +
                        "}" +

                        ".box .product-body .sub-text {" +
                                                       "padding-top: 1em;" +
                                                       "color: #aeaeae;" +
                        "}" +

                        ".box .product-details-link {" +
                                                      "padding: 1em 10px;" +
                        "}" +

                        ".box .product-details-link a {" +
                                                      "text-decoration: underline;" +
                        "}" +

                        ".box .buttons-wrapper {" +
                                                "position: relative;" +
                                                "left: 0;" +
                                                "bottom: 55px;" +
                                                "overflow: hidden;" +
                                                "padding: 10px;" +
                        "}" +

                        ".box a {" +
                                 "text-decoration: none;" +
                                 "outline: none;" +
                        "}" +

                        ".box .button {" +
                                       "position: relative;"+
                                       "width: 70px;" +
                                       "height: 30px;" +
                        "}" +

                        ".box .button {" +
                                       "background-repeat: no-repeat;" +
                                       "background-position: 50% 50%;" +
                        "}" +

                        ".box .button.next," +
                        ".box .button.prev{" +
                                          "float: left;" +
                        "}" +

                        ".box .button.find {" +
                                            "float: right;" +
                        "}" +

                        ".box .button .text {" +
                                            "line-height: 30px;" +
                        "}" +

                        ".box .button.prev .text {" +
                                                  "position: absolute;" +
                                                  "top: 0;" +
                                                  "right: 1em;" +
                                                 "}" +

                        ".box .button.next .text," +
                        ".box .button.find .text {" +
                                                  "position: absolute;" +
                                                  "top: 0;" +
                                                  "left: 1em;" +
                        "}" +

                        ".box .button .arrow {" +
                                              "line-height: 30px;" +
                                              "position: absolute;" +
                                              "width: 12px;" +
                                              "height: 100%;" +
                        "}" +

                        ".box .button .arrow {" +
                                              "background-repeat: no-repeat;" +
                                              "background-position: 50% 50%;" +
                        "}" +

                        ".box .button.prev .arrow {" +
                                                   "top: 0;" +
                                                   "left: 5px;" +
                        "}" +

                        ".box .button.next .arrow," +
                        ".box .button.find .arrow {" +
                                                   "top: 0;" +
                                                   "right: 5px;" +
                        "}";


        if (styles.styleSheet) {
           //for IE
           styles.styleSheet.cssText = cssRules;
        } else {
            //for other browsers
            styles.appendChild(document.createTextNode(cssRules));
        }

        document.getElementsByTagName("head")[0].appendChild(styles);
    };

    /**
     * Method for creating single tag
     * @param strTagName - tag
     * @param oAttr - attributes
     */
    var createHtmlTag = function(strTagName, oAttr) {
        var oTag = document.createElement(strTagName);

        if (oAttr !== null && typeof oAttr === "object") {
            for (var key in oAttr){
                if (oAttr.hasOwnProperty(key)) {
                    if (typeof oAttr[key] === "object") {
                        var obj = oAttr[key];
                        for (var param in obj) {
                            if (obj.hasOwnProperty(param)) {
                                oTag[key][param] = obj[param];
                            }
                        }
                    } else {
                        oTag[key] = oAttr[key];
                    }
                }
            }
        }

        return oTag;
    };

    /**
     * Method for creating one button
     *
     * @param strClassName
     * @param strText - button text
     * @param strHref - url
     * @returns {HTMLElement}
     */
    var createButton = function(strClassName, strText, strHref) {
        var oSpan, oButton, oDiv;

        oButton = createHtmlTag("a", {href : strHref});
        oDiv = createHtmlTag("div", {className : strClassName});
        oSpan = createHtmlTag("span", {className : "arrow"});
        oSpan.innerHTML = "&#160;";
        oDiv.appendChild(oSpan);
        oSpan = createHtmlTag("span", {className : "text"});
        oSpan.innerHTML = strText;
        oDiv.appendChild(oSpan);
        oButton.appendChild(oDiv);

        return oButton;
    };

    /**
     * Method for creating HTML-code
     *
     * @param oParent - object of parent block in which to insert info-box block
     * @param oSettings
     */
    var createHtml = function (oParent, oSettings) {
         var jsonData = oSettings.jsonData;

         boxSettings = oSettings;

         if (oParent == null) {
             return;
         }

        if (jsonData.length === 0) {
            throw new Error("Нет данных о продуктах");
            return;
        }

        oParent.className = "box";

        var oContent = createHtmlTag("div", {className : "content"});

        var oDiv;
        oDiv = createHtmlTag("div", {
            id    : elements.idProductPromo,
            className : "product-promo",
            style : {
                backgroundImage : getPromoBg()
            }
        });
        oContent.appendChild(oDiv);

        var oProductText = createHtmlTag("div", {id : "product-text"});

        //product header
        oDiv = createHtmlTag("div", {
            id : elements.idProductHeader,
            className : "product-header"
        });
        oDiv.innerHTML = jsonData[iProductIndex].title;
        oProductText.appendChild(oDiv);

        //product body
        oDiv = createHtmlTag("div", {
           id : elements.idProductBody,
           className : "product-body"
        });

        var p;
        p = createHtmlTag("p", {id : "product-body-main"});
        p.innerHTML = jsonData[iProductIndex].description;
        oDiv.appendChild(p);

        p = createHtmlTag("p", {
            id : "product-body-sub",
            className : "sub-text"
        });
        p.innerHTML = jsonData[iProductIndex].note;

        oDiv.appendChild(p);
        oProductText.appendChild(oDiv);

        //product details link
        oDiv = createHtmlTag("div", {
           id : elements.idProductDetails,
           className : "product-details-link"
        });
        addEvent(oDiv, "click", detailsShowHide);

        var a = createHtmlTag("a", {href : "#"});
        var span = createHtmlTag("span", {id : "details-label"});
        span.innerHTML = "show details";
        a.appendChild(span);
        oDiv.appendChild(a);

        oProductText.appendChild(oDiv);
        oContent.appendChild(oProductText);

        //buttons
        var oButtonsWrapper = createHtmlTag("div", {className : "buttons-wrapper"});

        //prev button
        var oPrevButton = createButton("button prev", lres.btnPrev, "#");
        addEvent(oPrevButton, "click", prevProduct);
        oButtonsWrapper.appendChild( oPrevButton );

        //next button
        var oNextButton = createButton("button next", lres.btnNext, "#");
        addEvent(oNextButton, "click", nextProduct);
        oButtonsWrapper.appendChild( oNextButton );

        //find button
        var oFindButton = createButton("button find", lres.btnFind, jsonData[iProductIndex].productUrl);
        oFindButton.setAttribute("id", elements.idStoreLink);
        addEvent(oFindButton, "click", findProductStore);
        oButtonsWrapper.appendChild( oFindButton );

        oParent.appendChild(oContent);
        oParent.appendChild(oButtonsWrapper);


    };

    return {
        /**
         *
         * @param parentBlockId - id of parent block in which to insert info-box block
         * @param settings - exemplar of class "InfoBoxSettings"
         */
       addTo : function(parentBlockId, settings){
            var jsonUrl;
            try {

                if (parentBlockId === "" || parentBlockId === undefined) {
                    throw new Error("Info-Box: Не передан ID блока для вставки виджета");
                }

                var obj = document.getElementById(parentBlockId);

                if (obj == null) {
                    throw new Error("Info-Box: Не найден блок с ID = " + parentBlockId + " для вставки виджета");
                }

                if (settings === undefined || !(settings instanceof InfoBoxSettings)) {
                    settings = new InfoBoxSettings();
                }

                //IE don`t understand location.origin
                if (!location.origin) {
                    location.origin = location.protocol + "//" + location.hostname + (location.port ? ":" + location.port : "");
                }

                jsonUrl = location.origin + location.pathname.replace(/[\/][a-zA-Z0-9]+[.][a-zA-Z#?_-]+/g, "") + "/" + settings.getProductDetailPath();

                settings.jsonData = getJsonData(jsonUrl);

                createStyle(settings);
                createHtml(obj, settings);

            } catch (e) {
                alert(e.message);
            }
       },

       Settings : InfoBoxSettings
    };

})();
