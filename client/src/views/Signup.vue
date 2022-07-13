<template>
    <section class="section col-md-6 m-auto">
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{errorMessage}}
        </div>
        <h1>sign up</h1>
        <form v-if="!signingUp" @submit.prevent="signup">
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input v-model="user.username" type="text" class="form-control" id="username" aria-describedby="username" placeholder="enter username" required>
                <div id="emailHelp" class="form-text"></div>
            </div>
            <div class="row">
                <div class="mb-3 col-md-6">
                    <label for="password" class="form-label">Password</label>
                    <input v-model="user.password" type="password" class="form-control" id="password" required>
                </div>
                <div class="mb-3 col-md-6">
                    <label for="confpassword" class="form-label">confirm Password</label>
                    <input v-model="user.confpassword" type="password" class="form-control" id="confpassword" required>
                </div>
            </div>
            <!-- <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="exampleCheck1">
                <label class="form-check-label" for="exampleCheck1">Check me out</label>
            </div> -->
            <button type="submit" class="btn btn-primary">Sign up</button>
        </form>
        <img v-if="signingUp" class="loading" src="../assets/Infinity-0.9s-201px.svg" alt="loading">
    </section>
</template>


<script>
    import joi from 'joi';

    const API_URL='http://localhost:5000/auth/signup';

    const schema =  joi.object().keys({
        username:joi.string().regex(/^[a-zA-Z0-9_]+$/).min(3).max(30).required(),
        password:joi.string().min(6).trim().required(),
        confpassword:joi.string().min(6).trim().required()
    });

   export default {
       data:()=>({
           signingUp:false,
           errorMessage:'',
           user:{
               username:'',
               password:'',
               confpassword:'',
           },
       }),
       watch:{
           user:{
               handler(){
                   this.errorMessage='';
               },
               deep:true,
           },
       },
       methods: {
           signup(){
               if(this.validUser()){
                   const body ={
                       username:this.user.username,
                       password:this.user.password
                   };

                    this.signingUp=true;

                   fetch(API_URL,{
                       method:"POST",
                       body:JSON.stringify(body),
                       headers:{
                           "content-type":"application/json"
                       }
                   }).then(response=>{
                       if(response.ok){
                           return response.json();
                       }else{
                           return response.json().then(err=>{
                               throw new Error(err.message);
                           });
                       }
                   }).then(user=>{
                       console.log(user);
                        setTimeout(()=>{

                           this.signingUp=false;
                           this.$router.push('/login');
                        },1000);

                   }).catch(err=>{
                       setTimeout(()=>{
                           this.signingUp=false;
                           this.errorMessage=err.message;
                       },1000);

                   });
               }
           },
           validUser(){
                if(this.user.password !== this.user.confpassword){
                    this.errorMessage="password not the same";
                    return false;
                }
                const result = schema.validate(this.user);
                const error = result.error;

                if (!error){
                    return true;
                }

                this.errorMessage=error.message;
                return false;
           },
       },
   };
</script>

<style>

    .section {
        position: relative;
    }

    .loading{
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
</style>