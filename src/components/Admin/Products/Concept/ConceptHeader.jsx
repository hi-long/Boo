import { Box, Button, IconButton, TextField, Typography } from "@material-ui/core"
import AddCircleIcon from '@material-ui/icons/AddCircle'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import FilterListIcon from '@material-ui/icons/FilterList'
import { Fragment, useState } from "react"
import { useDispatch } from "react-redux"
import { deleteConcept, updateConcept } from "../../../../store/product-action"
import Confirmation from "../../../Confirmation/Confirmation"
import CustomizedSnackbar from "../../../CustomizedSnackbar/CustomizedSnackbar.jsx"
import ProductModal from "../ProductModal/ProductModal"

const ConceptHeader = props => {
    const { concept, isOpened, toggleIsOpened, toggleFiltersIsOpened, filtersIsOpened } = props
    const [nameEditing, setNameEditing] = useState(false)
    const [nameTouched] = useState(false)
    const [newName, setNewName] = useState("")
    const [snackBarShowing, setSnackbarShowing] = useState()
    const [confirmationShowing, setConfirmationShowing] = useState(false)
    const [productModalShowing, setProductModalShowing] = useState(false)
    const dispatch = useDispatch()

    const onConceptNameChanged = () => {
        if (newName.trim() && newName !== concept.name) {
            setNameEditing(prevState => !prevState)
            dispatch(updateConcept({
                ...concept,
                name: newName
            }))
            setSnackbarShowing(true)
        }
    }

    const onConceptDelete = () => {
        dispatch(deleteConcept(concept.id))
        setSnackbarShowing(true)
    }

    const onProductModalClose = () => {
        setProductModalShowing(false)
    }

    return <Fragment>
        <Box display="flex" justifyContent="space-between" alignItems="center" component="header">
            {/* NAME + EXPAND ICON */}
            <Box display="flex" alignItems="center">
                <IconButton onClick={toggleIsOpened}>
                    {isOpened
                        ? <ExpandMoreIcon />
                        : <ExpandLessIcon />}
                </IconButton>
                {nameEditing
                    //  If changing name, show form 
                    ? <TextField
                        id="concept-name"
                        defaultValue={concept.name}
                        type="text"
                        InputProps={{ "minLength": "5" }}
                        error={nameTouched && newName.trim() === ''}
                        helperText={nameTouched && newName.trim() === '' && 'T??n kh??ng h???p l???'}
                        onChange={event => setNewName(event.target.value)} />
                    // Else, show concept name
                    : <Typography component="h2" variant="h5">{concept.name}</Typography>}
            </Box>
            {/* NEW PRODUCT + FILTERS */}
            {isOpened &&
                <Box display="flex" style={{ gap: "1rem" }}>
                    {/* ADD PRODUCT */}
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AddCircleIcon />}
                        onClick={() => setProductModalShowing(true)}>Th??m s???n ph???m</Button>
                    {/* FILTERS */}
                    <Button
                        variant={filtersIsOpened ? "contained" : "outlined"}
                        color={filtersIsOpened ? "secondary" : "primary"}
                        startIcon={<FilterListIcon />}
                        onClick={toggleFiltersIsOpened}>B??? l???c</Button>
                    {/* NAME CHANGING */}
                    {!nameEditing
                        ? <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => setNameEditing(prevState => !prevState)}>?????i t??n</Button>
                        : <Button
                            variant="contained"
                            color="secondary"
                            onClick={onConceptNameChanged}>X??c nh???n</Button>}
                    {/* DELETE */}
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<DeleteOutlineIcon />}
                        onClick={() => setConfirmationShowing(true)}>X??a</Button>
                    {/* CONFIRMATION */}
                    <Confirmation
                        confirmationShowing={confirmationShowing}
                        setConfirmationShowing={setConfirmationShowing}
                        title="X??a concept"
                        confirm="X??c nh???n" cancel="H???y b???"
                        content="B???n ch???c ch???n mu???n x??a concept n??y ch????"
                        confirmActions={onConceptDelete} />
                </Box>
            }
        </Box>
        {/* SNACKBAR */}
        <CustomizedSnackbar
            showing={snackBarShowing}
            setShowing={setSnackbarShowing}
            message="T???o s???n ph???m th??nh c??ng"
            severity="success" />

        <ProductModal
            concept={concept}
            productModalShowing={productModalShowing}
            setProductModalShowing={setProductModalShowing}
            onProductModalClose={onProductModalClose} />
    </Fragment >
}

export default ConceptHeader