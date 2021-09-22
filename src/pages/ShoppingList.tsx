import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonHeader, IonIcon, IonImg, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { IonRow, IonCol } from '@ionic/react';
import { QueryDeleteProduct, QueryShoppingList } from '../utils/Database';
import { getValue } from '../utils/utility';
import { trashBin } from 'ionicons/icons';

const useStyles = createUseStyles({
  card: {
    color: "black",
    backgroundColor: "#e0e0e0"
  }, 
  image: {
    height: "100px",
    width: "100%",
    marginTop: "10px",
  }
});

const ShoppingList: React.FC = () => {
    const [productList, setProductList] = useState<any>(null); //is the state that contains the products to be displayed
    const classes = useStyles();
    const event = new Event("trigger"); //is the event that allows me to update the shopping list

    //delete the product from the shopping list and from the local database
    const deleteProduct = async (idProduct: string) => {
      const email = await getValue("email");
      await QueryDeleteProduct(idProduct, email);
      document.dispatchEvent(event);
    }

    //takes from the database the products that have quantity = 0
    const getProducts = async () => {
      const email = await getValue("email");
      //the query that allows me to return products
      const products = (await QueryShoppingList(email))?.values;
      const arrayProducts: any = [];
      //for each product I create a card
      products?.forEach((product: any) => {
          arrayProducts.push(
            <IonCard className={classes.card}>
              {product.image ? <IonImg src={"data:image/jpeg;base64," + product.image} className={classes.image}/> : null}
              <IonCardHeader> 
                <IonCardTitle>
                  {product.name}
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonRow>
                  <IonCol>
                    {product.description}
                  </IonCol>
                  <IonCol>
                    <IonButton size="small" fill="clear" onClick={() => deleteProduct(product.id)} style={{float: "right"}}>
                      <IonIcon icon={trashBin} color="primary" />
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonCardContent>
            </IonCard>
          );
      });
      setProductList(arrayProducts);
    }

    //initialize the shopping list and wait for the update event
    useEffect(() => {
        getProducts();
        document.addEventListener('trigger', getProducts);
    }, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle class="ion-text-center">Track My Pantry</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding ion-text-center">
      <IonCard>
          <IonImg className={classes.image} src="assets/images/shoppingBag.png" />
          <IonCardHeader>
            <IonCol>
              <IonCardTitle> My shopping list </IonCardTitle>
            </IonCol>
          </IonCardHeader>
          <IonCardContent>
              <IonList>
                  {productList}
              </IonList>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ShoppingList;