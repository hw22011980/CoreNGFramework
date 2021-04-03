export interface TreeColumn {
    header?: string;
    name?: string;
    css_class?: string;
    sorted: number;
    sort_type: string;
    filter: Boolean;
    hidden: Boolean;
    width?: string;
    renderer?: any;
    header_renderer?: any;
    type?: string;
    case_sensitive_filter: Boolean;
    summary_renderer?: any;
    component?: any;
    on_component_init?: any;
}

export interface Actions {
    view_compare: boolean;
}

export interface CssClass {
    expand_class: string;
    collapse_class: string;
    row_selection_class: string;
    header_class: string;
    row_filter_class: string;
    table_class: string;
    view_compare_class: string;
}

export interface Configs {
    css: CssClass;
    columns?: TreeColumn[];
    data_loading_text: string;
    parent_id_field?: string;
    parent_display_field?: string;
    id_field?: string;
    action_column_width?: string;
    radio_column_width?: string;
    actions: Actions;
    filter: boolean;
    multi_select: boolean;
    compare_select: boolean;
    load_children_on_expand: boolean;
    show_summary_row: boolean;
    subgrid: boolean;
    subgrid_config?: Subgrid;
    row_class_function: Function;
    view_compare_column_text?: string;
    compare_select_one_text?: string;
    compare_select_two_text?: string;
    compare_select_one_imgUrl?: string;
    compare_select_two_imgUrl?: string;
}

export interface Subgrid {
    id_field?: string;
    show_summary_row: boolean;
    data_loading_text: string;
    columns?: TreeColumn[];
}


