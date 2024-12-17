import Image from 'next/image'; 
import styles from './global1.module.css';
export default function leaderboard() {
  return (
    <div id="main1">
<div id={styles.header}>
<h1>Ranking</h1>
<button className={styles.share}>
  <i className="ph ph-share-network"></i>
</button>
</div>
<div id={styles.leaderboard}>
{/*<div className={styles.ribbon}></div>*/}
<table style={{width:'100%'}}>
<tbody>
  <tr>
    <td className={styles.number}>1</td>
    <td className={styles.name}>Lee Taeyong</td>
    <td className={styles.points}>
      258.244 <Image className={styles.goldmedal} src="https://github.com/malunaridev/Challenges-iCodeThis/blob/master/4-leaderboard/assets/gold-medal.png?raw=true" alt="gold medal"/>
    </td>
  </tr>
  <tr>
    <td className={styles.number}>2</td>
    <td className={styles.name}>Mark Lee</td>
    <td className={styles.points}>258.242</td>
  </tr>
  <tr>
    <td className={styles.number}>3</td>
    <td className={styles.name}>Xiao Dejun</td>
    <td className={styles.points}>258.223</td>
  </tr>
  <tr>
    <td className={styles.number}>4</td>
    <td className={styles.name}>Qian Kun</td>
    <td className={styles.points}>258.212</td>
  </tr>
  <tr>
    <td className={styles.number}>5</td>
    <td className={styles.name}>Johnny Suh</td>
    <td className={styles.points}>258.208</td>
  </tr>
  </tbody>
</table>
<div id={styles.buttons}>
<button className={styles.exit}>Chippies</button>
  <button className={styles.exit}>Chipsters</button>
  <button className={styles.continue}>Gamers</button>
</div>
</div>

    </div>
)
}