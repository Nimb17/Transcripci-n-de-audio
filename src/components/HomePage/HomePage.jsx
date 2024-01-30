import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import style from './HomePage.module.css';
import { useDropzone } from 'react-dropzone';
import Loader from "../Loader";
import { OpenAI } from 'openai'
import ReactMarkdown from 'react-markdown'
import Modal from 'react-modal';
import { UserAuth } from '../../context/AuthContext';

const HomePage = () => {
  const { signout, user, token, getSupa } = UserAuth()

  const [file, setFile] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [resultado2, setResultado2] = useState(null);
  const [loadingWhisper, setLoadingWhisper] = useState(false);
  const [loadingGpt, setLoadingGpt] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); //modal    

  useEffect(() => {
    getSupa()
  }, [])

  const closeModal = () => {
    setModalIsOpen(false)
  }

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/*': [] }
  });

  const onFileUpload = async () => {
    setResultado(null)
    setResultado2(null)
    setLoadingWhisper(true)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', 'whisper-1');
    formData.append('language', 'es');

    try {
      const response = await axios.post('https://api.openai.com/v1/audio/transcriptions',
        formData,
      { headers:
         {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${import.meta.env.VITE_API_KEY}`
         }
      }
    );

      /* console.log(response.data); */
      setResultado(response.data.text);
    } catch (error) {
      console.error(error);
    }
    setLoadingWhisper(false)
  };

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_API_KEY, dangerouslyAllowBrowser: true
  });

  useEffect(() => {
    async function main() {
      setLoadingGpt(true)
      if (resultado !== null) {
        const completion = await openai.chat.completions.create({
          messages: [{
            role: 'user', content: `
            Usa la sintaxis y estructura profesional de markdown respetando titulo subtitulos, Texto en negrita, listas desordenadas etc. para la siguiente transcripcion de una reunion de Meet: " ${resultado} ".(sigue este ejemplo de la estructura respetando los 7 puntos):
              1. titulo de la reunion
  
              2. **Objetivo de la reunión**: Si están mencionados en la transcripción, resúmelos. Si no, escribe un breve resumen basado en el contexto.
              
              3. **Agenda**: Enumera los temas que se discutieron en la reunión, solamente si es que existe (no inventar).
              
              4. **Detalles de la discusión**: Este es el cuerpo principal del resumen. Aquí se incluirán los puntos de discusión de cada tema en la agenda, las ideas compartidas, y las decisiones tomadas. Debe estar estructurado de manera que cada tema discutido tenga su propio subtítulo y debajo de este, los puntos discutidos, solamente si es que existe (no inventar).
              
              5. **Acciones a seguir**:Si están mencionados en la transcripción, Enumera todas las tareas o acciones que se acordaron durante la reunión, si no esta mensionado debes incluir una sugerencia o propuesta de acciones a seguir (incluye un texto que diga que es una propuesta generada por IA).
              Debe incluir quién es responsable de cada tarea y cualquier fecha límite relevante,si no se nombran en la transcripcion ni un responsable ni fecha limite en el meet, se debe dejar en blanco.

              6. **Asuntos Pendientes**: Temas que no se trataron y que se posponen para una próxima reunión, solamente si es que existen.
              
              7. **Conclusiones**: Aquí debes resumir brevemente las conclusiones de la reunión. ¿Se lograron los objetivos de la reunión? ¿Qué se espera que ocurra como resultado de la reunión?)`
          }],
          model: "gpt-3.5-turbo-1106",
          max_tokens: 3500,
          temperature: 0,          
        });

        setResultado2(completion.choices[0].message.content)

      }
      setLoadingGpt(false)
    }

    main()

  }, [resultado])

  useEffect(() => {
    if (resultado2) {
      setModalIsOpen(true)
    }
  }, [resultado2])

  const handleClick = async () => {
    if (user) {
      await onFileUpload()
    }
  }

  return (
    <div className={style.container}>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className={style.modal}
        overlayClassName={style.overlay}
      >
        <section className={style.containerModal}>
          <h1>Transcripción</h1>
          <span></span>
          <div className={style.containerModal_Interno}>
            <ReactMarkdown>{resultado2}</ReactMarkdown>
          </div>

          <div className={style.footerModal}>
            <button onClick={closeModal}>Cerrar</button>
          </div>

        </section>
      </Modal>
      <section className={style.container__titulo}>
        <h1>Audio a Texto: Resúmenes de Reuniones</h1>
        <p>Obten los principales puntos y resumenes de tus reuniones</p>

      </section>
      <section className={style.container__form}>
        <article {...getRootProps()} className={`${style.upFile} ${isDragActive || file ? style.upFile_active : null}`}>
          <input {...getInputProps()} />
          {loadingWhisper || loadingGpt ? <div className={style.container__loading}><Loader /> {loadingWhisper ? "Transcribiendo..." : "Generando minuta..."}</div> :
            isDragActive
              ? <p className={style.container__textUP}>Suelta el archivo de audio aquí... </p>
              : !file
                ? <div className={style.container__text}> <p className={style.container__textUP}>Arrastra y suelta tu audio aquí</p> <p className={style.container__textUP}>-- o --</p> <p className={style.container__textBT}>haz clic para seleccionar un archivo</p></div>
                : <div><p className={style.container__textUP}>Archivo seleccionado:</p> {file.name}</div>
          }
        </article>

        <button onClick={handleClick}>Transcribir</button>
        <div className={style.container__formText}>Formatos: flac, mp3, mp4, mpeg, mpga, m4a, ogg, wav, or webm.</div>

        {/* <div className={style.container__respuesta}>
          <ReactMarkdown>{resultado2}</ReactMarkdown>
        </div>

        {resultado2 && <button onClick={handleToggle}>Ver Transcripción</button>}
        {toggle && <div className={style.container__respuesta} >

          <p className={style.container__resultado}>
            {resultado}
          </p>
        </div>} */}

        <button className={style.btnLoginOut} onClick={() => signout()}>Cerrar sesión</button>

      </section>


    </div>
  );
};

export default HomePage;