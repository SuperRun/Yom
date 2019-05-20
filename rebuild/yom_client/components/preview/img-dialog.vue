<template>

    <v-dialog
            v-model="imgDialog"
            max-width="290"
    >
        <v-card>
            <v-card-title class="headline">Tip</v-card-title>

            <v-card-text>
                Do you want to generate the project as a picture?
                See the picture below
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                        color="green darken-1"
                        flat="flat"
                        @click="$emit('show-imgdialog',false)"
                >
                    Cancel
                </v-btn>

                <v-btn
                        color="green darken-1"
                        flat="flat"
                        @click="generate"
                >
                    Generate
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

</template>

<script>
    import $ from 'jquery'
    let jsPDF = null
    if (process.client) {
         jsPDF = require('jspdf')
    }
    import domtoimage from 'dom-to-image'

    export default {
        data(){
          return {
              imgDialog: true
          }
        },
        props: [
            'doc'
        ],
        methods: {
           generate(){
               this.$emit('show-imgdialog',false);
               var date = new Date();
               var seperator1 = "-";
               var seperator2 = "_";
               var month = date.getMonth() + 1;
               var strDate = date.getDate();
               if (month >= 1 && month <= 9) {
                   month = "0" + month;
               }
               if (strDate >= 0 && strDate <= 9) {
                   strDate = "0" + strDate;
               }
               var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                   + " " + date.getHours() + seperator2 + date.getMinutes()
                   + seperator2 + date.getSeconds();
               var name = "projname_" + $('h1').text() + " time_" + currentdate;
			   var node = document.getElementById('pdf');
			   var height = $("#pdf").height();
			   var width = $("#pdf").width();
               domtoimage.toPng(pdf)
                   .then(function (dataUrl) {
                       var img = new Image();
                       img.src = dataUrl;
                       document.body.appendChild(img);
					   var pdf = new jsPDF({ format: [width, height]});
                       pdf.addImage(dataUrl, 'PNG', width/50, 0);
                       pdf.save(name + ".pdf");
                   });
           }
        }
    }
</script>

<style scoped>

</style>
