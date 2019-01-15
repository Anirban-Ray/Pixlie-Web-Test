<template>
  <div>
    <v-btn color="success"  @click="hero">
      New Hero
    </v-btn>
    <v-btn color="error"  @click="fight">
      fight To Death
    </v-btn>
    <v-btn color="warning"  @click="champion">
      Champion
    </v-btn>
    <div class="row">
      <div class="col-4">
        List of Heros
        <div v-for="(img,index) in images"  >
          <img width="100px" v-bind:src="img"><br/>
          <span>{{heroName[index]}}</span>
        </div>
      </div>
      <div class="col-4">
        Fight
        <div class="">
          <img width="100px" v-bind:src="fighterImage1">
          <span>{{hero1}}</span>
        </div>
        <div class="">
          <img width="100px" v-bind:src="fighterImage2">
          <span>{{hero2}}</span>
        </div>
        <span>{{fightText}}</span>
      </div>
    </div>
  </div>

</template>

<script>
  import axios from 'axios';
  export default {
    data: () => ({
        images:[],
        heroName:[],
        hero1:"",
        hero2:"",
        fighterImage1:"",
        fighterImage2:"",
        fightText:"",
        timer:"",

    }),
    mounted () {
      axios.post('http://localhost:3000/heroList').then(response => {
          console.log(response);
          if(response.data.message=="success"){
            if(response.data.result.length>0){
              for(var i=0; i<response.data.result.length;i++){
                this.images.push(response.data.imgURL);
                this.heroName.push(response.data.result[i].name);
              }

            }
          }

      })
    },
    methods: {
      hero () {
        axios.post('http://localhost:3000/hero').then(response => {
          if(response.data.message=="success"){
              console.log(response);
              this.images.push(response.data.imgURL);
              this.heroName.push(response.data.heroName);
          }else{
            console.log(response.data.message);
          }
        })
      },
      fight () {
        axios.post('http://localhost:3000/fight').then(response => {
          if(response.data.message=="success"){
              this.fighterImage1=response.data.imgURL;
              this.fighterImage2=response.data.imgURL;
              this.hero1=response.data.hero1Name;
              this.hero2=response.data.hero12Name;
              this.fightText="Fighting...."
              this.timer=setInterval(this.winFunction,2000);
          }else{
            console.log(response.data.message);
            alert("Only one hero alive");
          }
        })
      },
      champion () {
        axios.post('http://localhost:3000/champion').then(response => {
            if(response.data.message=="unsuccess"){
              alert("Fight Required- "+response.data.length+" Hero's Alive");
            }else{
              alert("Winner is- "+response.data.name);
            }
        });
      },
      winFunction(){
        clearInterval(this.timer);
        var winnerNumber=Math.floor(Math.random() * 2)+1;
        console.log(winnerNumber);
        var winner_name,loser_name;
        if(winnerNumber==1){
          winner_name=this.hero1;
          loser_name=this.hero2;
        }else {
          winner_name=this.hero2;
          loser_name=this.hero1;
        }
        axios.get('http://localhost:3000/winner?winner_name='+winner_name+'&loser_name='+loser_name).then(response => {
          if(response.data.message=="success"){
            this.fighterImage1="";
            this.fighterImage2="";
            this.hero1="";
            this.hero2="";
            this.fightText="";
            location.reload();
          }else{
            console.log(response.data.message);
          }
        })
      },
    }
  }
</script>

<style>

</style>
