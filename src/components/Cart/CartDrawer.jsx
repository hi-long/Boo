import { Drawer, makeStyles } from "@material-ui/core"
import { useDispatch, useSelector } from "react-redux"
import { uiActions } from "../../store/ui-slice"
import CartDrawerHeader from "./CartDrawerHeader"
import CartDrawerProducts from "./CartDrawerProducts"
import CartDrawerSummary from "./CartDrawerSummary"
import Confirmation from "../Confirmation/Confirmation"
import CustomizedSnackbar from "../CustomizedSnackbar/CustomizedSnackbar"
import { useState } from "react"

const useStyles = makeStyles({
    root: {
        "& .MuiDrawer-paper": {
            width: "28%",
            padding: "0"
        }
    }
})

const CartDrawer = props => {
    const dispatch = useDispatch()
    const cartDrawerShowing = useSelector(state => state.ui.cartDrawerShowing)
    const { localStorageCart, setLocalStorageCart } = props
    const [deleteItemConfirmShowing, setDeleteItemConfirmShowing] = useState(false)
    const [deleteItemSnackbarShowing, setDeleteItemSnackbarShowing] = useState(false)
    const [deleteProduct, setDeleteProduct] = useState()

    const classes = useStyles()

    const onDeleteIconClicked = product => {
        setDeleteItemConfirmShowing(true)
        setDeleteProduct(product)
        setTimeout(() => {
            console.log("DDDDD")
            setDeleteItemConfirmShowing(false)
        }, 2500)
    }

    const onItemDelete = () => {
        let { products, total } = localStorageCart
        products = products.filter(p => {
            const pId = p.item.id
            const pSize = p.item.size
            const dId = deleteProduct.item.id
            const dSize = deleteProduct.item.size
            return ((pId !== dId) || (pId === dId && pSize !== dSize))
        })
        total -= deleteProduct.item.price * +deleteProduct.quantity
        setLocalStorageCart({ products, total })
        setDeleteItemSnackbarShowing(true)
    }

    return <Drawer
        className={classes.root}
        display="flex"
        anchor="right"
        open={cartDrawerShowing}
        variant="temporary"
        onClose={() => dispatch(uiActions.setCartDrawerShowing(false))}>
        {/* HEADER */}
        <CartDrawerHeader noItems={localStorageCart.products.length} />
        {/* PRODUCTS */}
        <CartDrawerProducts
            onDeleteIconClicked={onDeleteIconClicked}
            localStorageCart={localStorageCart}
            setLocalStorageCart={setLocalStorageCart}></CartDrawerProducts>
        {/* SUMMARY */}
        <CartDrawerSummary total={localStorageCart.total} />
        {/* ADDITIONAL */}
        <Confirmation
            title="X??a s???n ph???m"
            content="B???n ch???c ch???n mu???n x??a s???n ph???m kh???i gi??? ch????"
            confirm="Ti???p t???c"
            cancel="H???y"
            confirmActions={onItemDelete}
            confirmationShowing={deleteItemConfirmShowing}
            setConfirmationShowing={setDeleteItemConfirmShowing}
        />
        <CustomizedSnackbar
            message="X??a s???n ph???m th??nh c??ng"
            severity="success"
            showing={deleteItemSnackbarShowing}
            setShowing={setDeleteItemSnackbarShowing} />
    </Drawer>
}

export default CartDrawer