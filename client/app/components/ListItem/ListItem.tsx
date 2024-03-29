import styles from './ListItem.module.css';
import MaterialSymbolIcon from 'MaterialSymbolIcon';
import { ListItemProps } from './ListItem.type'

const ListItem: React.FC<ListItemProps> = ({ iconTitle = "", text, imageSrc = '', isMaterialIcon = true, type }) => {

  return (
    <>
      <div className={styles.listItemStyle} data-type={type}>
        {isMaterialIcon ? (
          <MaterialSymbolIcon title={iconTitle} />
        ) : (
          <img src={imageSrc} style={{ height: 16, width: 16 }} alt={text} />
        )}
        {text}
      </div>
    </>
  )
};

export default ListItem;

