sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
 ], function (Controller) {
    "use strict";
    return Controller.extend("org.ubb.books.controller.BookList", {
       
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
        }
    });
 });