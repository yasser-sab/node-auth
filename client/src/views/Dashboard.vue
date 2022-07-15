<template>
    <section>
        <div v-if="!connect">
            <h1>Dashboard</h1>
            <h2>{{user.username}}</h2>
            <button @click="logout()">logout</button>
        </div>
        <img v-if="connect" class="loading" src="../assets/Infinity-0.9s-201px.svg" alt="loading"/>
    </section>
</template>

<script>
    const API_URL = 'http://localhost:5000/';
    export default{
        data:()=>({
            connect:false,
            user:{}
        }),
        mounted(){
            fetch(API_URL,{
                headers:{
                    'authorization':`Bearer ${localStorage.token}`
                }
            })
            .then(response=>response.json())
            .then(result=>{
                if(result.user){
                    this.user=result.user;
                }else{
                    this.logout();
                }
            });
        },
        methods:{
            logout(){
                this.connect=true;
                setTimeout(()=>{
                    localStorage.removeItem('token');
                    this.connect=false;
                    this.$router.push('/login');
                },1000)
            }
        }
    };
</script>

<style>
</style>