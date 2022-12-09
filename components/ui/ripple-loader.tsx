import css from '../../styles/components/ui/ripple-loader.module.scss'

const RippleLoader = () => {
  return (
    <div className={css['loader']}>
      <div className={css['lds-ripple']}>
        <div />
        <div />
      </div>
    </div>
  )
}

export default RippleLoader
