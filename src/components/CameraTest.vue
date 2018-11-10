<template>
    <v-card>
        <h1>Camera test page</h1>
        <v-btn @click="takePic">Take a pic</v-btn>
        <v-img :src="imageSrc" v-if="imageSrc"></v-img>
        <h1 id="out"></h1>
    </v-card>
</template>
<script>
export default {
    data: function() {
        return {
            imageSrc: null
        }
    },
    methods: {
        takePic: function () {
            document.getElementById("out").innerHTML = JSON.stringify(navigator.camera);
            navigator.camera.getPicture(this.onSuccess, this.onFail, { quality: 50, destinationType: Camera.DestinationType.FILE_URI });
        },
        onSuccess: function(imageURI) {
            this.imageSrc = imageURI;
            console.log(imageURI);
        },
        onFail: function(message) {
            alert('Failed because: ' + message);
        }
    }
}
</script>
