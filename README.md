
[Demo page](http://cdv-dev.github.io/info-box-js/)

**Подключение и настройка js-модуля**

  ```html
  <body>
  
     <!-- в конце body после других Javascript файлов -->
     <!-- модуль -->
     <script type="text/javascript" src="src/js/infobox.creator.js"></script>
     <script>
        // настройки модуля:
        // Settings.setSkinCssPath(url) - путь к css-файлу для изменения скина блока (если не задан, по умолчанию  "src/css/box.skin.css" )
        // Settings.setProductDetailsPath(url) - путь к JSON-данным (если не задан, по умолчанию "src/info_box.json")
        // Settings.setImagesPath(url) - путь к каталогу с графикой (если не задан, по умолчанию "src/img")
        infoBoxSettings = new infoBox.Settings;
        //первый параметр - id блока на странице, в который будет вставлен Info-box
        infoBox.addTo("info-box", infoBoxSettings);
     </script>
  </body>
  ```
  
  Если подключен jquery, будет анимация.  
  Работает в IE7+, Chrome, FireFox, Safari, Opera.
  
