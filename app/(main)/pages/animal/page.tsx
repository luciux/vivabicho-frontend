/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { Projeto } from '@/types';
import { AnimalService } from '@/service/AnimalService';

/* @todo Used 'as any' for types here. Will fix in next version due to onSelectionChange event type issue. */
const Crud = () => {
    let emptyAnimal: Projeto.Animal = {
        nome: '',
        especieId: 1,
        raca: '',
        cor: '',
        idade: 0,
        sexo: '',
        tamanho: '',
        peso: 0,
        disponivelParaAdocao: true,
        descricao: '',
    };

    const [animals, setAnimals] = useState<Projeto.Animal[]>([]);
    const [animalDialog, setAnimalDialog] = useState(false);
    const [deleteAnimalDialog, setDeleteAnimalDialog] = useState(false);
    const [deleteAnimalsDialog, setDeleteAnimalsDialog] = useState(false);
    const [animal, setAnimal] = useState<Projeto.Animal>(emptyAnimal);
    const [selectedAnimals, setSelectedAnimals] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);
    const animalService = new AnimalService();

    useEffect(() => {
        animalService.getAnimals().then((response) => {
            console.log(response.data);
            setAnimals(response.data);
        }).catch((error) => {
            console.log(error);
        });
    }, [animals]);


    const openNew = () => {
        setAnimal(emptyAnimal);
        setSubmitted(false);
        setAnimalDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setAnimalDialog(false);
    };

    const hideDeleteAnimalDialog = () => {
        setDeleteAnimalDialog(false);
    };

    const hideDeleteAnimalsDialog = () => {
        setDeleteAnimalsDialog(false);
    };

    const saveAnimal = () => {
        setSubmitted(true);
        if (!animal.id) {
            animalService.insertAnimal(animal).then((response) => {
                setAnimalDialog(false);
                setAnimal(emptyAnimal);
                setAnimals([])
                toast.current?.show({
                    severity: 'info',
                    summary: 'Animal criado com sucesso',
                    detail: 'Animal criado com sucesso',
                    life: 3000
                });
            }).catch((error) => {
                console.log(error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro ao criar animal',
                    detail: 'Erro ao criar animal',
                    life: 3000
                });
            });
        } else {
            animalService.updateAnimal(animal).then((response) => {
                setAnimalDialog(false);
                setAnimal(emptyAnimal);
                setAnimals([])
                toast.current?.show({
                    severity: 'info',
                    summary: 'Animal atualizado com sucesso',
                    detail: 'Animal atualizado com sucesso',
                    life: 3000
                });
            }).catch((error) => {
                console.log(error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Erro ao atualizar animal',
                    detail: 'Erro ao atualizar animal' + error.message,
                    life: 3000
                });
            });
        }

        // if (animal.name.trim()) {
        //     let _animals = [...(animals as any)];
        //     let _animal = { ...animal };
        //     if (animal.id) {
        //         const index = findIndexById(animal.id);

        //         _animals[index] = _animal;
        //         toast.current?.show({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Animal Updated',
        //             life: 3000
        //         });
        //     } else {
        //         _animal.id = createId();
        //         _animal.image = 'animal-placeholder.svg';
        //         _animals.push(_animal);
        //         toast.current?.show({
        //             severity: 'success',
        //             summary: 'Successful',
        //             detail: 'Animal Created',
        //             life: 3000
        //         });
        //     }

        //     setAnimals(_Animals as any);
        //     setAnimalDialog(false);
        //     setAnimal(emptyAnimal);
        // }
    };

    const editAnimal = (animal: Projeto.Animal) => {
        setAnimal({ ...animal });
        setAnimalDialog(true);
    };

    const confirmDeleteAnimal = (animal: Projeto.Animal) => {
        setAnimal(animal);
        setDeleteAnimalDialog(true);
    };

    const deleteAnimal = () => {
        setSubmitted(true);
        if (!animal.id || typeof animal.id !== 'number' || animal.id <= 0) {
            console.error('ID de animal inválido:', animal.id);
            return;
        }
        animalService.deleteAnimal(animal.id).then((response) => {
            setDeleteAnimalDialog(false);
            setAnimal(emptyAnimal);
            setAnimals([])
            toast.current?.show({
                severity: 'success',
                summary: 'Animal deletado com sucesso',
                detail: 'Animal deletado com sucesso',
                life: 3000
            });
        }).catch((error) => {
            console.log(error);
            toast.current?.show({
                severity: 'error',
                summary: 'Erro ao deletar animal',
                detail: 'Erro ao deletar animal',
                life: 3000
            });
        });
    };

    // const findIndexById = (id: string) => {
    //     let index = -1;
    //     for (let i = 0; i < (animals as any)?.length; i++) {
    //         if ((animals as any)[i].id === id) {
    //             index = i;
    //             break;
    //         }
    //     }

    //     return index;
    // };

    // const createId = () => {
    //     let id = '';
    //     let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     for (let i = 0; i < 5; i++) {
    //         id += chars.charAt(Math.floor(Math.random() * chars.length));
    //     }
    //     return id;
    // };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteAnimalsDialog(true);
    };

    const deleteSelectedAnimals = () => {
        // let _animals = (animals as any)?.filter((val: any) => !(selectedAnimals as any)?.includes(val));
        // setAnimals(_animals);
        // setDeleteAnimalsDialog(false);
        // setSelectedAnimals(null);
        // toast.current?.show({
        //     severity: 'success',
        //     summary: 'Successful',
        //     detail: 'Animals Deleted',
        //     life: 3000
        // });
    };

    // const onCategoryChange = (e: RadioButtonChangeEvent) => {
    //     let _animal = { ...animal };
    //     _animal['category'] = e.value;
    //     setAnimal(_animal);
    // };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _animal = { ...animal };
        _animal[`${name}`] = val;

        setAnimal(_animal);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value || 0;
        let _animal = { ...animal };
        _animal[`${name}`] = val;

        setAnimal(_animal);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="Novo" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Excluir" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedAnimals || !(selectedAnimals as any).length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const idBodyTemplate = (rowData: Projeto.Animal) => {
        return (
            <>
                <span className="p-column-title">Código</span>
                {rowData.id}
            </>
        );
    };

    const nameBodyTemplate = (rowData: Projeto.Animal) => {
        return (
            <>
                <span className="p-column-title">Nome</span>
                {rowData.nome}
            </>
        );
    };

    // const imageBodyTemplate = (rowData: Projeto.Animal) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Image</span>
    //             <img src={`/demo/images/animal/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
    //         </>
    //     );
    // };

    // const categoryBodyTemplate = (rowData: Projeto.Animal) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Category</span>
    //             {rowData.category}
    //         </>
    //     );
    // };

    // const ratingBodyTemplate = (rowData: Projeto.Animal) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Reviews</span>
    //             <Rating value={rowData.rating} readOnly cancel={false} />
    //         </>
    //     );
    // };

    // const statusBodyTemplate = (rowData: Projeto.Animal) => {
    //     return (
    //         <>
    //             <span className="p-column-title">Status</span>
    //             <span className={`animal-badge status-${rowData.inventoryStatus?.toLowerCase()}`}>{rowData.inventoryStatus}</span>
    //         </>
    //     );
    // };

    const actionBodyTemplate = (rowData: Projeto.Animal) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editAnimal(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteAnimal(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Animals</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const animalDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Salvar" icon="pi pi-check" text onClick={saveAnimal} />
        </>
    );
    const deleteAnimalDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteAnimalDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteAnimal} />
        </>
    );
    const deleteAnimalsDialogFooter = (
        <>
            <Button label="Não" icon="pi pi-times" text onClick={hideDeleteAnimalsDialog} />
            <Button label="Sim" icon="pi pi-check" text onClick={deleteSelectedAnimals} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={animals}
                        selection={selectedAnimals}
                        onSelectionChange={(e) => setSelectedAnimals(e.value as any)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} até {last} de {totalRecords} animais"
                        globalFilter={globalFilter}
                        emptyMessage="Nenhum animal encontrado."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="id" header="Code" sortable body={idBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="nome" header="Nome" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        {/* <Column header="Image" body={imageBodyTemplate}></Column>
                        <Column field="price" header="Price" body={priceBodyTemplate} sortable></Column>
                        <Column field="category" header="Category" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable></Column>
                        <Column field="inventoryStatus" header="Status" body={statusBodyTemplate} sortable headerStyle={{ minWidth: '10rem' }}></Column> */}
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={animalDialog} style={{ width: '450px' }} header="Detalhes dos Animais" modal className="p-fluid" footer={animalDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="nome">Nome</label>
                            <InputText
                                id="nome"
                                value={animal.nome}
                                onChange={(e) => onInputChange(e, 'nome')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !animal.nome
                                })}
                            />
                            {submitted && !animal.nome && <small className="p-invalid">Nome é um campo obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="raca">Raça</label>
                            <InputText
                                id="raca"
                                value={animal.raca}
                                onChange={(e) => onInputChange(e, 'raca')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !animal.raca
                                })}
                            />
                            {submitted && !animal.raca && <small className="p-invalid">Raça é um campo obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="sexo">Sexo</label>
                            <InputText
                                id="sexo"
                                value={animal.sexo}
                                onChange={(e) => onInputChange(e, 'sexo')}
                                required
                                autoFocus
                                className={classNames({
                                    'p-invalid': submitted && !animal.sexo
                                })}
                            />
                            {submitted && !animal.sexo && <small className="p-invalid">Sexo é um campo obrigatório.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="observacao">Observações</label>
                            <InputTextarea id="observacao" value={animal.descricao} onChange={(e) => onInputChange(e, 'descricao')} required rows={3} cols={20} />
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="idade">Idade</label>
                                <InputNumber id="idade" value={animal.idade} onValueChange={(e) => onInputNumberChange(e, 'idade')} />
                            </div>
                        </div>
                    </Dialog>

                    <Dialog visible={deleteAnimalDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteAnimalDialogFooter} onHide={hideDeleteAnimalDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {animal && (
                                <span>
                                    Você tem certeza que deseja excluir o animal: <b>{animal.nome}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteAnimalsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteAnimalsDialogFooter} onHide={hideDeleteAnimalsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {animal && <span>Tem certeza que deseja deletar os animais selecionados?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Crud;
