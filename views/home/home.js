app.controller('featuredProps', function($scope, tokkoApi) {
  $scope.featured = [];
  $scope.apiReady = false;
  let data = JSON.parse(_.clone(tokkoSearchArgs.sData));
  data.filters.push(["is_starred_on_web", "=", "true"]);
  let args = {data: JSON.stringify(data), order: 'desc'}
  tokkoApi.find('property/search', args, function(result){
    let props = [];
    result.forEach((p) => {
      props.push({
        id: p.id,
        title: p.publication_title,
        area: p.type.id === 1 ? p.surface : p.roofed_surface,
        type: p.operations[0].operation_type,
        currency: p.operations[p.operations.length-1].prices.slice(-1)[0].currency,
        price: p.operations[p.operations.length-1].prices.slice(-1)[0].price,
        rooms: p.suite_amount,
        baths: p.bathroom_amount,
        parkings: p.parking_lot_amount,
        // Not working yet because there is props without front cover photo asigned
        //cover_photo: p.photos.map(function(p){if(p.is_front_cover){return p.thumb}})[0],
        // Instead we take the first photo as cover.
        cover_photo: p.photos[0].image,
        prop: p,
      })
    });
    $scope.featured = props;
    $scope.apiReady = true;
    $scope.$apply();
    uiFunctions.buildCarousel();
    $(window).trigger('resize');
  });
});

app.controller('homeSearch', function($rootScope, $scope, $state) {
  $rootScope.activeMenu = 'home';
  $scope.operationType = [2];
  $scope.subTypes = [];  

  $scope.isPropertyTypeOpen = false;
  $scope.isSubPropertyTypeOpen = false;

  $scope.wasFindPropertiesButtonClicked = false;
  $scope.isPropertyPlaceholderWarningActive = false;  

  $scope.subTypeSelected = {
    id: -1,
    name:"Condición"
  };

  $scope.propertyType = {
    id: -1,
    name: "Tipo de Propiedad"
  };

  $scope.propertiesTypes = propertiesTypes;    

  $scope.updateTypeChosen = function(newType) {  
    $scope.propertyType = newType;

    $scope.isPropertyTypeOpen = false;
    $scope.isSubPropertyTypeOpen = false;
    $scope.isPropertyPlaceholderWarningActive = false;

    if ($scope.propertiesTypes.some(type => type.id == -1) && $scope.propertiesTypes[0] != -1) $scope.propertiesTypes.shift();            
    
    $scope.subTypeSelected = propertiesSubTypes[$scope.propertyType.id][0]; 
    
    $scope.subTypes = propertiesSubTypes[$scope.propertyType.id].filter(type => type.id != $scope.subTypeSelected.id);
    
    $scope.propertiesTypes = propertiesTypes.filter(type => type.id != newType.id); 
  };

  $scope.updateSubTypeChosen = (newType) => {
    $scope.subTypeSelected = newType;

    $scope.isPropertyTypeOpen = false;
    $scope.isSubPropertyTypeOpen = false;

    $scope.subTypes = propertiesSubTypes[$scope.propertyType.id].filter(type => type.id != $scope.subTypeSelected.id);
  };

  $scope.togglePropertyTypeDropdown = () => {    
    $scope.isSubPropertyTypeOpen = false;
    $scope.isPropertyTypeOpen = !$scope.isPropertyTypeOpen;
  };

  $scope.toggleSubPropertyTypeDropdown = () => {
    $scope.isPropertyTypeOpen = false;
    if ($scope.propertyType.id != -1 && $scope.subTypes.length > 1) $scope.isSubPropertyTypeOpen = !$scope.isSubPropertyTypeOpen;
  };

  $scope.closeOpenSelects = () => {
    $scope.isPropertyTypeOpen = false;
    $scope.isSubPropertyTypeOpen = false;
  };

  $scope.findProperties = () => {
    $scope.wasFindPropertiesButtonClicked = true;

    if ($scope.propertyType.id == -1) {
      $scope.isPropertyPlaceholderWarningActive = true;

      setTimeout(() => {
        $scope.isPropertyPlaceholderWarningActive = false;
        $scope.$apply();
      }, 2000);
    }
    else {
      $scope.isPropertyPlaceHolderWarningActive = false;
      $scope.find();
    }
  }

  setTimeout(function(){
    uiFunctions.buildParallax();
    uiFunctions.buildChosen();
    uiFunctions.buildSearchTypeButtons();
    uiFunctions.buildBackToTop();
  }, 0);

  $scope.find = () => {
    let data = JSON.parse(_.clone(tokkoSearchArgs.sData));
    data.operation_types = [$scope.operationType[0]];    
    if ($scope.propertyType) data.property_types = [$scope.propertyType.id];
    if ($scope.subTypeSelected) {
      data.with_custom_tags = $scope.subTypeSelected.id == 0 ? [] : [$scope.subTypeSelected.id];
    }
    let args = {data: JSON.stringify(data), offset: 0};
    $state.go('propertySearch', {args: JSON.stringify(args)});
    // $http.post("/propertySearch/",$httpParamSerializer(args));
    // $location.path("/propertySearch/"+{data: JSON.stringify(data), order: 'desc'});
  }
});

app.controller('home', function($scope) {
  const duitWhatsapp = '5493518172255';
  const duitPhone = '+5493518172255';

  $scope.isContactGlobeOpen = false;
  $scope.contactGlobeTitle = "Te asesoramos!";

  $scope.contactGlobeOpenIcon = {
    iconClass: 'fab fa-whatsapp',
      color: '#128c7e',
      fontSize: '3rem'   
  };

  $scope.contactGlobeCloseIcon = {
    iconClass: 'fa fa-times',
    color: 'var(--soft-grey)',
    fontSize: '3rem' 
  };

  $scope.contactGlobeActions = [
    {
      hRef: `tel:${duitPhone}`,
      iconClass: 'fa fa-phone',
      fontSize: '2.3rem'
    },
    {
      hRef: '#',
      iconClass: 'fa fa-envelope',
      fontSize: '2.5rem'
    },
    {
      hRef: `https://api.whatsapp.com/send?phone=${duitWhatsapp}`,
      iconClass: 'fab fa-whatsapp',
      color: '#128c7e',
      fontSize: '3rem'
    },
  ];

  $scope.toggleContactModal = () => $scope.isContactGlobeOpen = !$scope.isContactGlobeOpen;

  $scope.agents = agents;
  $scope.agents.forEach(agent => agent.phone = agent.phone.replace(/[()]/g, '').replace(/^0351/, '351'));  

  $scope.formatCellPhone = (phone) => `549${phone.replace(/^0|\+|\-|\s/g, '')}`.replace(/^(54935115)/, '549351');

  $scope.services = [
    {
      iconClass: "fas fa-building",
      linkTo: "contactUs",
      linkTitle: "Contactános",
      mainTitle: "Te aconsejamos",
      description: "El equipo profesional de Duit te asistirá en todo momento, bridandote todos los consejos necesarios para que tomes la decisión mas adecuada."
    },
    {
      iconClass: "far fa-building",
      linkTo: "developments",
      linkTitle: "Mas info",
      mainTitle: "Alquiler",
      description: "Seleccionamos los mejores emprendimientos y las mejores empresas desarrollistas del mercado para ponerlos a tu alcance."
    },
    {
      iconClass: "far fa-building",
      linkTo: "developments",
      linkTitle: "Mas info",
      mainTitle: "Venta",
      description: "Seleccionamos los mejores emprendimientos y las mejores empresas desarrollistas del mercado para ponerlos a tu alcance."
    },    
    {
      iconClass: "far fa-building",
      linkTo: "developments",
      linkTitle: "Mas info",
      mainTitle: "Administración",
      description: "Seleccionamos los mejores emprendimientos y las mejores empresas desarrollistas del mercado para ponerlos a tu alcance."
    },
    {
      iconClass: "fas fa-home",
      linkTo: "contactUs",
      linkTitle: "Contactános",
      mainTitle: "Valuamos tu casa",
      description: "¿Querés saber cual es el valor de tu propiedad? Nuestro Staff de consejeros matriculados CPCPI valuarán profesionalmente tus bienes."
    }        
  ];

  $scope.servicesLinks = [
    {
      imgSrc: "/images/services/service-1.png",
      goTo: "consejeros" 
    },
    {
      imgSrc: "/images/services/service-2.png",
      goTo: "searchBar" 
    },
    {
      imgSrc: "/images/services/service-3.png",
      goTo: "searchBar" 
    },
    {
      imgSrc: "/images/services/service-4.png",
      goTo: "contacto" 
    },
    {
      imgSrc: "/images/services/service-5.png",
      goTo: "contacto" 
    }
  ]

  $scope.goToSection = (id) => { 
    var newHash = id;    
    
    if ($location.hash() !== newHash) {
      $location.hash(id);
    }

    else $anchorScroll();
  };

  

});