var koodiApp = angular.module('koodiApp', ['ngRoute', 'ui.select', 'ui.bootstrap']);
koodiApp.controller('koodiController', function($scope,$http,$window)
{
  //
  // PRIVAATIT FUNKTIOT
  //

  //
  // SCOPE
  //

  // oma versio unique:sta
  // ks: http://stackoverflow.com/questions/15914658/how-to-make-ng-repeat-filter-out-duplicate-results
  //     https://github.com/angular-ui/angular-ui-OLDREPO/blob/master/modules/filters/unique/unique.js
  $scope.uniikit = function () {
    // katsotaan ensin onko koodi tai nimi sarake mukana, jolloin kaikki rivit mukaan
    for(var c=0; c<$scope.sarakkeet.length; c++){
      var col = $scope.sarakkeet[c];
      if(col.a=="koodi" || col.a=="nimi") {
        if (col.nayta==1) {
          return $scope.luokitus;
        }
      }
    }
    var loopi = 0;
    var newItems = [];

    // tehdään ensin luokituksesta kopio items, jossa on sitten vain valitut sarakkeet
    var items = [];
    // tehdään valn valituilla sarakkeilla varustettu objekti, jotta equals toimii
    for(var i=0; i<$scope.luokitus.length; i++){
      var item = $scope.luokitus[i];
      var newItem = {};
      for(var c=0; c<$scope.sarakkeet.length; c++){
        var col = $scope.sarakkeet[c];
        loopi++;
        if (col.nayta==1) {
          newItem[col.a] = item[col.a];
        }
      }
      items.push(newItem);
    }
    // populoidaan newItems, jossa uniikit kappaleet
    if (angular.isArray(items)) {
      // ja nyt käytetään karsittua objektia
      for(var i=0; i<items.length; i++){
        var item = items[i];
        if(item["koodi"] || item["nimi"]) {
          return items;
        }
        var hasContent = false;
        // varmista ettei kaikki ole tyhjää
        angular.forEach(item, function(iobj) {
          if (iobj) {
            hasContent = true;
          }
        });
        if (hasContent) {
          var isDuplicate = false;
          for (var n=0; n<newItems.length; n++) {
            loopi++;
            if (angular.equals(newItems[n], item)) {
              isDuplicate = true;
              break;
            }
          }
          if (!isDuplicate) {
            newItems.push(item);
          }
        }
      }
    }
    return newItems;
  }

  $scope.useSarakkeet = function(s) {
    //console.debug("useSarakkeet")
    s.nayta=(s.nayta?0:1);
    $scope.koodit = $scope.uniikit();
    var ret = Object.values($scope.sarakkeet).map(function(k){
      if (k.nayta) {
        return "sarake="+k.selite;
      }
    })
    .filter(function(n){ return n != undefined })
    .join('&');
    $scope.query = ret;
  }

  $scope.toURIParam = function(data) {
    //console.debug("toURIParam")
    if (!data) return "";
    var ret = Object.keys(data).map(function(k){
      if (!data[k]) {return "";}
      return encodeURIComponent(findItem($scope.sarakkeet,"a",k).selite)+"="+encodeURIComponent(data[k]);
    }).join('&');
    if (ret) ret="&"+ret;
    return ret;
  }

  //
  // ASETUKSET & ALUSTUS
  //

  $scope.sarakkeet = [
    {"a":"koodi","selite":"Koodi","nayta":1,"ryhma":"perus","koodi":1}
    ,{"a":"nimi","selite":"Nimi","nayta":1,"ryhma":"perus","koodi":0}
    ,{"a":"alkupvm","selite":"Alkupvm","nayta":0,"ryhma":"muut","koodi":0}
    ,{"a":"loppupvm","selite":"Loppupvm","nayta":0,"ryhma":"muut","koodi":0}
    ,{"a":"koulutusaste2002koodi","selite":"opmast","nayta":0,"ryhma":"2002","koodi":1}
    ,{"a":"koulutusaste2002nimi","selite":"Koulutusaste 2002","nayta":0,"ryhma":"2002","koodi":0}
    ,{"a":"koulutusala2002koodi","selite":"opmala","nayta":0,"ryhma":"2002","koodi":1}
    ,{"a":"koulutusala2002nimi","selite":"Koulutusala 2002","nayta":0,"ryhma":"2002","koodi":0}
    ,{"a":"opintoala2002koodi","selite":"opmopa","nayta":0,"ryhma":"2002","koodi":1}
    ,{"a":"opintoala2002nimi","selite":"Opintoala 2002","nayta":0,"ryhma":"2002","koodi":0}
    ,{"a":"koulutusaste1995koodi","selite":"opm95ast","nayta":0,"ryhma":"1995","koodi":1}
    ,{"a":"koulutusaste1995nimi","selite":"Koulutusaste 1995","nayta":0,"ryhma":"1995","koodi":0}
    ,{"a":"koulutusala1995koodi","selite":"opm95ala","nayta":0,"ryhma":"1995","koodi":1}
    ,{"a":"koulutusala1995nimi","selite":"Koulutusala 1995","nayta":0,"ryhma":"1995","koodi":0}
    ,{"a":"opintoala1995koodi","selite":"opm95opa","nayta":0,"ryhma":"1995","koodi":1}
    ,{"a":"opintoala1995nimi","selite":"Opintoala 1995","nayta":0,"ryhma":"1995","koodi":0}
    ,{"a":"tutkintoonjohtavakoulutuskoodi","selite":"tutkjoht","nayta":0,"ryhma":"muut","koodi":1}
    ,{"a":"tutkintoonjohtavakoulutusnimi","selite":"Tutkintoon johtava","nayta":0,"ryhma":"muut","koodi":0}
    ,{"a":"tutkintokoodi","selite":"tutk","nayta":0,"ryhma":"muut","koodi":1}
    ,{"a":"tutkintonimi","selite":"Tutkinto","nayta":0,"ryhma":"muut","koodi":0}
    ,{"a":"tutkintotyyppikoodi","selite":"tutktyyp","nayta":0,"ryhma":"muut","koodi":1}
    ,{"a":"tutkintotyyppinimi","selite":"Tutkintotyyppi","nayta":0,"ryhma":"muut","koodi":0}
    ,{"a":"koulutustyyppikoodi","selite":"koultyyp","nayta":0,"ryhma":"muut","koodi":1}
    ,{"a":"koulutustyyppinimi","selite":"Koulutustyyppi","nayta":0,"ryhma":"muut","koodi":0}
    ,{"a":"tutkintonimikekkkoodi","selite":"tutknimikekk","nayta":0,"ryhma":"muut","koodi":1}
    ,{"a":"tutkintonimikekknimi","selite":"Tutkintonimike kk","nayta":0,"ryhma":"muut","koodi":0}
    ,{"a":"isced2011koulutusastekoodi","selite":"isced2011koulutusaste","nayta":0,"ryhma":"2011","koodi":1}
    ,{"a":"isced2011koulutusastenimi","selite":"Level","nayta":0,"ryhma":"2011","koodi":0}
    ,{"a":"isced2011koulutusastetaso1koodi","selite":"isced2011koulutusastetaso1","nayta":0,"ryhma":"2011","koodi":1}
    ,{"a":"isced2011koulutusastetaso1nimi","selite":"Koulutusaste (taso1)","nayta":0,"ryhma":"2011","koodi":0}
    ,{"a":"isced2011koulutusastetaso2koodi","selite":"isced2011koulutusastetaso2","nayta":0,"ryhma":"2011","koodi":1}
    ,{"a":"isced2011koulutusastetaso2nimi","selite":"Koulutusaste (taso2)","nayta":0,"ryhma":"2011","koodi":0}
    ,{"a":"isced2011koulutusalataso1koodi","selite":"isced2011koulutusalataso1","nayta":0,"ryhma":"2011","koodi":1}
    ,{"a":"isced2011koulutusalataso1nimi","selite":"Koulutusala (taso1), Broad field","nayta":0,"ryhma":"2011","koodi":0}
    ,{"a":"isced2011koulutusalataso2koodi","selite":"isced2011koulutusalataso2","nayta":0,"ryhma":"2011","koodi":1}
    ,{"a":"isced2011koulutusalataso2nimi","selite":"Koulutusala (taso2), Narrow field","nayta":0,"ryhma":"2011","koodi":0}
    ,{"a":"isced2011koulutusalataso3koodi","selite":"isced2011koulutusalataso3","nayta":0,"ryhma":"2011","koodi":1}
    ,{"a":"isced2011koulutusalataso3nimi","selite":"Koulutusala (taso3), Detailed field","nayta":0,"ryhma":"2011","koodi":0}
    ,{"a":"kansallinenkoulutusluokitus2016koulutusastetaso1koodi","selite":"kansallinenkoulutusluokitus2016koulutusastetaso1","nayta":0,"ryhma":"2016","koodi":1}
    ,{"a":"kansallinenkoulutusluokitus2016koulutusastetaso1nimi","selite":"Koulutusaste, taso1","nayta":1,"ryhma":"2016","koodi":0}
    ,{"a":"kansallinenkoulutusluokitus2016koulutusastetaso2koodi","selite":"kansallinenkoulutusluokitus2016koulutusastetaso2","nayta":0,"ryhma":"2016","koodi":1}
    ,{"a":"kansallinenkoulutusluokitus2016koulutusastetaso2nimi","selite":"Koulutusaste, taso2","nayta":0,"ryhma":"2016","koodi":0}
    ,{"a":"kansallinenkoulutusluokitus2016koulutusalataso1koodi","selite":"kansallinenkoulutusluokitus2016koulutusalataso1","nayta":0,"ryhma":"2016","koodi":1}
    ,{"a":"kansallinenkoulutusluokitus2016koulutusalataso1nimi","selite":"Koulutusala, taso1","nayta":0,"ryhma":"2016","koodi":0}
    ,{"a":"kansallinenkoulutusluokitus2016koulutusalataso2koodi","selite":"kansallinenkoulutusluokitus2016koulutusalataso2","nayta":0,"ryhma":"2016","koodi":1}
    ,{"a":"kansallinenkoulutusluokitus2016koulutusalataso2nimi","selite":"Koulutusala, taso2","nayta":0,"ryhma":"2016","koodi":0}
    ,{"a":"kansallinenkoulutusluokitus2016koulutusalataso3koodi","selite":"kansallinenkoulutusluokitus2016koulutusalataso3","nayta":0,"ryhma":"2016","koodi":1}
    ,{"a":"kansallinenkoulutusluokitus2016koulutusalataso3nimi","selite":"Koulutusala, taso3","nayta":0,"ryhma":"2016","koodi":0}
    ,{"a":"okmohjauksenalakoodi","selite":"okmohjauksenala","nayta":0,"ryhma":"2016","koodi":1}
    ,{"a":"okmohjauksenalanimi","selite":"OKM ohjauksen ala","nayta":1,"ryhma":"2016","koodi":0}
  ];

  // when bootstrap xs size hide some cols
  //console.debug(window.innerWidth,$window.innerWidth)
  if ($window.innerWidth<768) {
    angular.forEach($scope.sarakkeet,function(s,k){
      if(s.a!="koodi" && s.a!="nimi"){
        s.nayta=0;
      }
    });
  }

  $scope.baseuri = location.origin+location.pathname;
  $scope.query = "";

  $scope.koodit = [];
  $scope.luokitus = [];
  $scope.koodistoLataa = true;
  $scope.koodiOrder = 'koodi';
  $scope.koodiOrderReverse = false;

  $scope.koodistokoodilkm = 0;

  geturi = "/api/json/koulutusluokitus"
  if (location.hostname=='127.0.0.1' || location.hostname=='localhost') {
    geturi="koulutusluokitus.json"
  }
  $http.get(geturi)
  .then(function (response){
    $scope.luokitus = response.data;
    $scope.koodit = $scope.uniikit();
    $scope.koodistoLataa = false;
  });

  $scope.search = {};

  $scope.sarakkeet.forEach(function(e,i,arr) {
    if (QueryString[e.selite]) {
      $scope.search[e.a] = QueryString[e.selite];
    }
  });

  if (QueryString.sarake) {
    $scope.sarakkeet.forEach(function(e,i,arr) {
      e.nayta=0;
    });
    var sArr = [];
    if (angular.isArray(QueryString.sarake)) {
      sArr = QueryString.sarake;
    } else {
      if (QueryString.sarake.indexOf(",")>=0) {
        sArr = QueryString.sarake.split(",");
      } else {
        sArr.push(QueryString.sarake);
      }
    }
    angular.forEach(sArr, function(sobj,skey) {
      $scope.useSarakkeet(findItem($scope.sarakkeet,"selite",sobj));
    });
  }
});//-koodiController

// NB! Not used for now as there is a problem with Safari...
koodiApp.filter('regex', function() {
  return function(input, regex) {
    //console.debug(input)
    if(!regex) return input;
    //console.debug(regex,Object.keys(regex).length,angular.equals({},regex))
    // clear empty strings away
    angular.forEach(regex,function(value,field){
      if(value==""){
        delete regex[field];
      }
    });
    if(angular.equals({},regex)){//nothing to rule out..
      return input;//..so return all
    }
    // else...
    // start finding matches
    var out = [];
    for(var i=0; i<input.length; i++){
      var addit=true;//see if all patterns give ok
      angular.forEach(regex,function(value,field){
        var patt = new RegExp(value,'i');
        if(!patt.test(input[i][field])){ //if even one says no..
          addit=false;//..it's a no!
        }
      });
      if(addit){
        out.push(input[i]);
      }
    }
    return out;
  };
});
