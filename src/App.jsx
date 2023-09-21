import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import style from './App.module.css';
import { useDropzone } from 'react-dropzone';
import Loader from './components/Loader';
import { OpenAI } from 'openai'
import ReactMarkdown from 'react-markdown'

const AudioUpload = () => {
  const [file, setFile] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [resultado2, setResultado2] = useState(null);
  const [loading, setLoading] = useState(false);



  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const onFileUpload = async () => {
    setLoading(true)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'whisper-1');

    try {
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
        }
      });

      /* console.log(response.data); */
      setResultado(response.data.text);
    } catch (error) {
      console.error(error);
    }
    setLoading(false)
  };

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_API_KEY, dangerouslyAllowBrowser: true
  });

  useEffect(() => {
    async function main() {
      setLoading(true)
      if (resultado !== null) {
        const completion = await openai.chat.completions.create({
          messages: [{
            role: 'user', content: `
            Usa la sintaxis y estructura profesional de markdown respetando titulo subtitulos, Texto en negrita, listas desordenadas etc (si encuentras la palabra "Cuba o cua" en realidad es Q.A) para la siguiente transcripcion de una reunion de Meet: " ${resultado} ".(sigue este ejemplo de la estructura respetando los 6 puntos):
              1. titulo de la reunion
  
              2. **Objetivo de la reunión**: Esboza el propósito o los objetivos de la reunión.
              
              3. **Agenda**: Enumera los temas que se discutieron en la reunión.
              
              4. **Detalles de la discusión**: Este es el cuerpo principal del resumen. Aquí se incluirán los puntos de discusión de cada tema en la agenda, las ideas compartidas, y las decisiones tomadas. Debe estar estructurado de manera que cada tema discutido tenga su propio subtítulo y debajo de este, los puntos discutidos.
              
              5. **Acciones a seguir**: Enumera todas las tareas o acciones que se acordaron durante la reunión, incluyendo quién es responsable de cada tarea y cualquier fecha límite relevante.
              
              6. **Conclusiones**: Aquí debes resumir brevemente las conclusiones de la reunión. ¿Se lograron los objetivos de la reunión? ¿Qué se espera que ocurra como resultado de la reunión?)`
          }],
          model: 'gpt-3.5-turbo-16k',
          max_tokens: 3500,
          temperature: 0.1,
        });

        setResultado2(completion.choices[0].message.content)
      }
      setLoading(false)
    }

    main()

  }, [resultado])

  const handleClick = async () => {
    setResultado("")
    setResultado2("")
    await onFileUpload()

    
  }

  return (
    <div className={style.container}>
      <section className={style.container__titulo}>
        <h1>Audio a Texto: Resúmenes de Reuniones</h1>
        <p>Obten los principales puntos y resumenes de tus reuniones</p>

      </section>
      <section className={style.container__form}>
        <article {...getRootProps()} className={`${style.upFile} ${isDragActive || file ? style.upFile_active : null}`}>
          <input {...getInputProps()} />
          {loading ? <div className={style.container__loading}><Loader /> espere un momento...</div> :
            isDragActive ?
              <p className={style.container__textUP}>Suelta el archivo de audio aquí... </p> :
              !file ? <div className={style.container__text}><p className={style.container__textUP}>Arrastra y suelta tu audio aquí</p> <p className={style.container__textUP}>-- o --</p> <p className={style.container__textBT}>haz clic para seleccionar un archivo</p></div> : <div><p className={style.container__textUP}>Archivo seleccionado:</p> {file.name}</div>
          }
        </article>

        <button onClick={handleClick}>Transcribir</button>
        <div className={style.container__formText}>Formatos: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.</div>

        <div className={style.container__respuesta}>
          <ReactMarkdown>{resultado2}</ReactMarkdown>
        </div>

        <div className={style.container__respuesta}>

          {resultado && <p className={style.container__resultado}>{resultado}</p>}
        </div>

      </section>

    </div>
  );
};

export default AudioUpload;