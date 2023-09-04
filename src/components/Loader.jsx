import style from "./Loader.module.css"

const Loader = () => {
  return (
    <div className={style.loader}>
    <span className={style.bar}></span>
    <span className={style.bar}></span>
    <span className={style.bar}></span>
</div>
  )
}

export default Loader