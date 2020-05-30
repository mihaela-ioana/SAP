sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
   "sap/ui/model/resource/ResourceModel",
   "sap/ui/model/Sorter",
   "sap/ui/table/library"
 ], function (Controller, MessageToast, Fragment, Filter, FilterOperator, FilterType, ResourceModel, library, Sorter) {
    "use strict";
    // shortcut for sap.ui.table.SortOrder
    var SortOrder = library.SortOrder;
    
    return Controller.extend("org.ubb.books.controller.BookList", {

        onInit : function () {
            // set i18n model on view
            var i18nModel = new ResourceModel({
               bundleName: "org.ubb.books.i18n.i18n"
            });
            this.getView().setModel(i18nModel, "i18n");

            //Initial sorting
			var oTitleColumn = this.getView().byId("title");
			// this.getView().byId("idBooksTable").sort(oTitleColumn, sap.ui.table.SortOrder.Ascending);
         },

        onBookDialogOpen: function(event) {
            var oView = this.getView();
            if (!this.byId("addDialog") ) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
                    name: "org.ubb.books.view.AddDialog",
                    controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
                    oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
                this.insertInputData();
				this.byId("addDialog").open();
			}
        },

        onBorrowedDialogOpen: function(event) {
            var oView = this.getView();
            if (!this.byId("borrowDialog") ) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
                    name: "org.ubb.books.view.BorrowedDialog",
                    controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
                    oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("borrowDialog").open();
			}
        },

        insertInputData: function() {
            var oItem = this.getView().byId("idBooksTable").getSelectedItem();

            if (oItem !== null){
                var oEntry = oItem.getBindingContext().getObject();
                this.getView().byId('newISBN').setValue(oEntry.ISBN);
                this.getView().byId('newTitle').setValue(oEntry.Title);
                this.getView().byId('newAuthor').setValue(oEntry.Author);
                this.getView().byId('newLanguage').setValue(oEntry.Language);
                this.getView().byId('newPublishDate').setValue(oEntry.PublishDate);
                this.getView().byId('newNbAvailableBooks').setValue(oEntry.NbAvailableBooks);
                this.getView().byId('newTotalNbBooks').setValue(oEntry.TotalNbBooks);
            } else {
                this.getView().byId('newISBN').setValue("");
                this.getView().byId('newTitle').setValue("");
                this.getView().byId('newAuthor').setValue("");
                this.getView().byId('newLanguage').setValue("");
                this.getView().byId('newPublishDate').setValue("");
                this.getView().byId('newNbAvailableBooks').setValue("");
                this.getView().byId('newTotalNbBooks').setValue("");
            }

            
        },

        onCloseDialog : function () {
			this.byId("addDialog").close();
        },

        onCloseBorrowedDialog : function () {
			this.byId("borrowDialog").close();
        },
        
        onAddBook() {
            var isbn = this.getView().byId('newISBN').getValue();
            var title = this.getView().byId('newTitle').getValue();
            var author = this.getView().byId('newAuthor').getValue();
            var language = this.getView().byId('newLanguage').getValue();
            var publish = this.getView().byId('newPublishDate').getValue();
            var nbAv = this.getView().byId('newNbAvailableBooks').getValue();
            var totalNbAv = this.getView().byId('newTotalNbBooks').getValue();

            var oEntry = {
                ISBN: isbn,
                Title: title,
                Author: author,
                Language: language,
                PublishDate: publish,
                NbAvailableBooks: nbAv,
                TotalNbBooks: totalNbAv
            };

            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var sRecipient = this.getView().getModel().getProperty("/recipient/name");
            var sMsg = oBundle.getText("addBookSuccess", [sRecipient]);
            var sMsgError = oBundle.getText("addBookError", [sRecipient]);
            
            this.getView().getModel().create("/Books", oEntry, {
                success: () => {
                    MessageToast.show(sMsg);
                },
                error: () => {
                    MessageToast.show(sMsgError);
                }
            });
            this.onCloseDialog();
            
        },

        onUpdateBook() {
            var isbn = this.getView().byId('newISBN').getValue();
            var title = this.getView().byId('newTitle').getValue();
            var author = this.getView().byId('newAuthor').getValue();
            var language = this.getView().byId('newLanguage').getValue();
            var publish = this.getView().byId('newPublishDate').getValue();
            var nbAv = this.getView().byId('newNbAvailableBooks').getValue();
            var totalNbAv = this.getView().byId('newTotalNbBooks').getValue();

            var oEntry = {
                ISBN: isbn,
                Title: title,
                Author: author,
                Language: language,
                PublishDate: publish,
                NbAvailableBooks: nbAv,
                TotalNbBooks: totalNbAv
            };

            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var sRecipient = this.getView().getModel().getProperty("/recipient/name");
            var sMsg = oBundle.getText("updateBookSuccess", [sRecipient]);
            var sMsgError = oBundle.getText("updateBookError", [sRecipient]);
            
            var sPath = this.byId("idBooksTable").getSelectedContexts()[0].getPath();
            this.getView().getModel().update(sPath, oEntry, {
                success: () => {
                    MessageToast.show(sMsg);
                },
                error: () => {
                    MessageToast.show(sMsgError);
                }
            });
            this.onCloseDialog();
        },
       
        onDeleteBook(oEvent) {
            const aSelContexts = this.byId("idBooksTable").getSelectedContexts();
            const sPathToBook = aSelContexts[0].getPath();

            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var sRecipient = this.getView().getModel().getProperty("/recipient/name");
            var sMsg = oBundle.getText("deleteBookSuccess", [sRecipient]);
            var sMsgError = oBundle.getText("deleteBookError", [sRecipient]);

            this.getView().getModel().remove(sPathToBook, {
                success: () => {
                    MessageToast.show(sMsg);
                },
                error: () => {
                    MessageToast.show(sMsgError);
                }
            });
        },

        onSort: function () {
			var oSmartTable = this._getSmartTable();
			if (oSmartTable) {
				oSmartTable.openPersonalisationDialog("Sort");
			}
        },

        sortTitles : function(oEvent) {
			var oView = this.getView();
			var oTable = oView.byId("idBooksTable");
			var oTitlesColumn = oView.byId("Title");

			oTable.sort(oTitlesColumn, this._bSortColumnDescending ? SortOrder.Descending : SortOrder.Ascending, /*extend existing sorting*/true);
			this._bSortColumnDescending = !this._bSortColumnDescending;
		},

        clearAllSortings : function(oEvent) {
			var oTable = this.byId("idBooksTable");
			oTable.getBinding("rows").sort(null);
			this._resetSortingState();
        },
        
        _resetSortingState : function() {
			var oTable = this.byId("idBooksTable");
			var aColumns = oTable.getColumns();
			for (var i = 0; i < aColumns.length; i++) {
				aColumns[i].setSorted(false);
			}
		},
        
        _getSmartTable: function () {
			if (!this._oSmartTable) {
				this._oSmartTable = this.getView().byId("idBooksTable");
			}
			return this._oSmartTable;
        },
        
        onFilterTitle: function (oEvent) {
            var oView = this.getView();
			var	sValue = oView.byId("searchFieldTitle").getValue();
            var	oFilter = new Filter("Title", FilterOperator.Contains, sValue);
            
            var oItemTemplate = sap.ui.getCore().byId("Title").clone();
            oView.byId("idBorrowedTable").bindAggregation("items", {
                path: "/BorrowedBooks",
                template: oItemTemplate,
                filters: [oFilter] 
                });

            // oView.byId("idBorrowedTable").getBinding("items").filter(oFilter, FilterType.Application);
            
			// build filter array
			// var aFilter = [];
			// var sQuery = oEvent.getParameter("query");
			// if (sQuery) {
			// 	var oFilter1 = new sap.ui.model.Filter("Firstname", sap.ui.model.FilterOperator.Contains, sQuery);
            //     var oFilter2 = new sap.ui.model.Filter("Lastname", sap.ui.model.FilterOperator.Contains, sQuery);
            //     var oFilter3 = new sap.ui.model.Filter("Title", sap.ui.model.FilterOperator.Contains, sQuery);
            //     var oFilter4 = new sap.ui.model.Filter("Author", sap.ui.model.FilterOperator.Contains, sQuery);
            //     var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2, oFilter3, oFilter4], false); 
            //     var oTable = this.getView().byId("idBorrowedTable");
            //     var oBinding = oTable.getBinding("items");
            //     oBinding.filter(allFilter);
			// }

			// filter binding
			// var oTable = this.byId("idBorrowedTable");
			// var oBinding = oEvent.getSource().getBinding("items");
			// oBinding.filter(aFilter);
        },
        
        onBorrowedBook: function(oEvent) {
            var itemPosition = oEvent.getSource().getBindingContext().getObject();
            var isbn = itemPosition.ISBN;

            var oEntry = {
                Id: "1",
                Firstname: "",
                Lastname: "",
                Username: "",
                CheckoutDate: itemPosition.PublishDate,
                ReturnDate: itemPosition.PublishDate,
                ISBN: isbn,
                Title: "",
                Author: ""
            };

            if(itemPosition.NbAvailableBooks == "00000"){
                MessageToast.show("There are no more books to check out!");
            } else {
                var oBundle = this.getView().getModel("i18n").getResourceBundle();
                var sRecipient = this.getView().getModel().getProperty("/recipient/name");
                var sMsg = oBundle.getText("addCheckoutSuccess", [sRecipient]);
                var sMsgError = oBundle.getText("addCheckoutError", [sRecipient]);

                this.getView().getModel().create("/BorrowedBooks", oEntry, {
                    success: () => {
                        MessageToast.show(sMsg);
                        this.byId("idBooksTable").getBinding("items").refresh();
                        // this.byId("idBorrowedTable").getBinding("items").refresh();
                    },
                    error: () => {
                        MessageToast.show(sMsgError);
                    }
                });
            }
        }

    });
 });

//  onOpenMultiEdit: function() {
//     this.oMultiEditDialog = sap.ui.xmlfragment("org.ubb.books.view.AddDialog", this);
//     this.getView().addDependent(this.oMultiEditDialog);
//     this.oMultiEditDialog.setEscapeHandler(function() {
//         this.onCloseDialog();
//     }.bind(this));

//     this.oMultiEditDialog.getContent()[0].setContexts(this.getView().byId("idBooksTable").getTable().getSelectedContexts());
//     jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.oMultiEditDialog);
//     this.oMultiEditDialog.open();
// },

// onCloseDialog: function() {
//     this.oMultiEditDialog.close();
//     this.oMultiEditDialog.destroy();
//     this.oMultiEditDialog = null;
// },