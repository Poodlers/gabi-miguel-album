<script>
	import { onMount } from "svelte";

    // Array of cute messages
    const messages = [
      "Feliz 7 meses de namoro! 🥰",
    ];
  
    // Calculate the message index based on the current date
    const today = new Date();
    const index = today.getDate() % messages.length; // Ensure it wraps around
    const message = messages[index];
    let portoTemperature = 0;
    let stuttgartTemperature = 0;
    onMount(() => {
      fetch('https://api.open-meteo.com/v1/forecast?latitude=48.783333&longitude=9.17702&current=temperature_2m')
        .then(response => response.json())
        .then(data => {
          stuttgartTemperature = data.current.temperature_2m;
        });

      fetch('https://api.open-meteo.com/v1/forecast?latitude=41.14961&longitude=-8.6109&current=temperature_2m')
        .then(response => response.json())
        .then(data => {
          portoTemperature = data.current.temperature_2m;
        });
    });

  </script>
  
  
  <div class="text-center font-bold text-md my-2">
    Mensagem do dia: {message}
  </div>
  <p class="text-center font-bold text-sm w-11/12">De momento, estão {portoTemperature}ºC no Porto e {stuttgartTemperature}ºC em Estugarda. Apesar de estarmos separados por 
    {Math.round(Math.abs(portoTemperature - stuttgartTemperature))} graus, estás sempre no meu coração!</p>
  