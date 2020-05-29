sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
 ], function (Controller, MessageToast, Fragment) {
    "use strict";
    return Controller.extend("org.ubb.books.controller.BookList", {

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
                    this.insertInputData();
					oDialog.open();
				});
			} else {
                this.insertInputData();
				this.byId("addDialog").open();
			}
        },

        insertInputData: function() {
            var oItem = this.getView().byId("idBooksTable").getSelectedItem();

            if (oItem !== null){
                console.log("I was selected!");
                var oEntry = oItem.getBindingContext().getObject();
                this.getView().byId('newISBN').setValue(oEntry.ISBN);
                this.getView().byId('newTitle').setValue(oEntry.Title);
                this.getView().byId('newAuthor').setValue(oEntry.Author);
                this.getView().byId('newLanguage').setValue(oEntry.Language);
                this.getView().byId('newPublishDate').setValue(oEntry.PublishDate);
                this.getView().byId('newNbAvailableBooks').setValue(oEntry.NbAvailableBooks);

            } else {
                console.log("I was not selected!");
            }

            
        },

        onCloseDialog : function () {
			this.byId("addDialog").close();
        },
        
        onAddBook() {
            var isbn = this.getView().byId('newISBN').getValue();
            var title = this.getView().byId('newTitle').getValue();
            var author = this.getView().byId('newAuthor').getValue();
            var language = this.getView().byId('newLanguage').getValue();
            var publish = this.getView().byId('newPublishDate').getValue();
            var nbAv = this.getView().byId('newNbAvailableBooks').getValue();

            var oEntry = {
                ISBN: isbn,
                Title: title,
                Author: author,
                Language: language,
                PublishDate: publish,
                NbAvailableBooks: nbAv
            };
            
            this.getView().getModel().create("/Books", oEntry, {
                success: () => {
                    MessageToast.show("Book added sucessfully!");
                },
                error: () => {
                    MessageToast.show("Book could not be added!");
                }
            });
            
        },

        onUpdateBook() {
            var isbn = this.getView().byId('newISBN').getValue();
            var title = this.getView().byId('newTitle').getValue();
            var author = this.getView().byId('newAuthor').getValue();
            var language = this.getView().byId('newLanguage').getValue();
            var publish = this.getView().byId('newPublishDate').getValue();
            var nbAv = this.getView().byId('newNbAvailableBooks').getValue();

            var oEntry = {
                ISBN: isbn,
                Title: title,
                Author: author,
                Language: language,
                PublishDate: publish,
                NbAvailableBooks: nbAv
            };
            
            var sPath = this.byId("idBooksTable").getSelectedContexts()[0].getPath();
            this.getView().getModel().update(sPath, oEntry, {
                success: () => {
                    MessageToast.show("Book updated sucessfully!");
                },
                error: () => {
                    MessageToast.show("Book could not be updated!");
                }
            });
        },
       
        onDeleteBook(oEvent) {
            const aSelContexts = this.byId("idBooksTable").getSelectedContexts();
            const sPathToBook = aSelContexts[0].getPath();

            this.getView().getModel().remove(sPathToBook, {
                success: () => {
                    MessageToast.show("Book deleted sucessfully!");
                },
                error: () => {
                    MessageToast.show("Book could not be deleted!");
                }
            });
        },

        onSort: function () {
			var oSmartTable = this._getSmartTable();
			if (oSmartTable) {
				oSmartTable.openPersonalisationDialog("Sort");
			}
        },
        
        _getSmartTable: function () {
			if (!this._oSmartTable) {
				this._oSmartTable = this.getView().byId("idBooksTable");
			}
			return this._oSmartTable;
		},

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