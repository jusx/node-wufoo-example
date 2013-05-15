$(function(){
   function toUrl(path) {
      return "http://0.0.0.0:8080/api" + path;
   }
   
   // form model.
   var Form = Backbone.Model.extend({});
   
   // field model
   var Field = Backbone.Model.extend({});
   
   // the list of forms
   var FormList = Backbone.Collection.extend({
      model: Form,
      url: toUrl("/forms"),
   });
   var forms = new FormList();
   
   // list of fields
   var FieldList = Backbone.Collection.extend({
      model: Field,
      url: function() {
         return toUrl("/forms/" + this.formid + "/fields");
      },
   })
   
   
   // form view
   var FormView = Backbone.View.extend({
      template: _.template($('#form-template').html()),
      tagName: 'li',

      
      events: {
         "click .form a.js-field-click" : "toggleFields"
      },
      
      fieldListElm: function() {
         return this.$el.find("#field-list");
      },
      
      render: function() {
         this.$el.html(this.template(this.model.toJSON()));
         return this;
      },
      
      scrollToMe: function() {
         $('html,body').animate({scrollTop: this.$el.offset().top},'fast');
      },
      
      toggleFields: function(e) {
         e.preventDefault();
         if (this.$el.attr("data-fields-status") == "loaded") {
            this.fieldListElm().toggle();
            if (!this.fieldListElm().is(":hidden")) this.scrollToMe();
         } else {
            this.fields = new FieldList();
            this.fields.formid = this.model.id;

            this.listenTo(this.fields, "add", this.addField);
            var self = this;
            this.fields.fetch({
               success: function() {
                  self.fieldListElm().show();
                  self.loaded();
                  self.scrollToMe();
               }
            })
         }
      },
      
      loaded: function() {
         this.$el.attr("data-fields-status", "loaded");
      },
      
      addField: function(field) {
         var view = new FieldView({model: field});
         this.fieldListElm().append(view.render().el);
      }
      
   })
   
   
   // field list view
   var FieldView = Backbone.View.extend({
      tagName: 'li',
      template: _.template($('#field-template').html()),
      
      render: function() {
         this.$el.html(this.template(this.model.toJSON()));
         return this;
      }
      
   }) 
   
   // the app.
   var AppView = Backbone.View.extend({
      el: $("#formapp"),
      
      initialize: function() {
         this.listenTo(forms, "add", this.addForm);
         forms.fetch();
      },
      
      addForm: function(form) {
         var view = new FormView({model: form});
         $(this.el).find("#form-list").append(view.render().el);
      },
   });
   
   var app = new AppView();
   
});