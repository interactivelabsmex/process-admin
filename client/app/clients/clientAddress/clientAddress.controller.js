'use strict';
(function () {

  class ClientAddressComponent {

    constructor($uibModal, $stateParams, $state, noty, factoryServices, $scope, $log, $confirm) {
      this.$confirm = $confirm;
      this.$log = $log;
      this.factoryServices = factoryServices;
      this.$uibModal = $uibModal;
      this.$scope = $scope;
      this.noty = noty;
      this.$state = $state;
      this.client = $stateParams.client;
      if (this.client === null) {
        this.$state.go('client.all', null, {
          reload: true
        });
      } else {
        this.getClientInfo();
      }
    }

    getClientInfo() {
      var _this = this;
      _this.factoryServices.getResourceById('clients', this.client.idClient).then(function (response) {
        _this.client = response;
      }), function (err) { }
    }

    addNewItem() {
      this.addEditItem({
        idClient: this.client.idClient
      });
    }

    addEditItem(address) {
      this.$scope.$parent.openAddressForm(this.client, address);
    }

    delete(address) {
      var _this = this;
      this.$confirm({
        text: 'Estas seguro de borrar el registro??'
      })
        .then(function () {
          _this.factoryServices.deleteResource('address', address.idAddress).then(function () {
            _this.back();
          });
        });
    }

    back() {
      this.$state.go('client.address', {
        client: this.client
      }, {
        reload: true
      });
    }
  }

  angular.module('processAdminApp')
    .component('clientAddress', {
      templateUrl: 'app/clients/clientAddress/clientAddress.html',
      controller: ClientAddressComponent,
      controllerAs: '$cn'
    });

})();
