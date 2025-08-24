# reports/utils.py

import openpyxl
from openpyxl.styles import Font, Alignment, Border, Side, PatternFill
from openpyxl.utils import get_column_letter
from django.http import HttpResponse
from datetime import datetime

def generate_excel_report(queryset, model_class):
    """
    Generates an Excel file from a given queryset and returns it as an HttpResponse.
    """
    # --- 1. Create Workbook and Worksheet ---
    wb = openpyxl.Workbook()
    ws = wb.active
    model_name = model_class._meta.verbose_name_plural.title()
    ws.title = model_name

    # --- 2. Define Styles ---
    header_font = Font(name='Calibri', size=12, bold=True, color='FFFFFF')
    header_fill = PatternFill(start_color='4F81BD', end_color='4F81BD', fill_type='solid')
    header_alignment = Alignment(horizontal='center', vertical='center')
    cell_alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)
    thin_border = Border(left=Side(style='thin'), right=Side(style='thin'), top=Side(style='thin'), bottom=Side(style='thin'))

    # --- 3. Get Model Fields ---
    # Exclude non-relevant fields for the report
    excluded_fields = ['id', 'user', 'department', 'created_at', 'updated_at']
    fields = [field for field in model_class._meta.get_fields() if field.name not in excluded_fields and not field.is_relation]
    
    # Add related fields we want to show
    headers = ['Faculty Name', 'Department'] + [field.verbose_name.title() for field in fields]

    # --- 4. Write Header Row and Apply Styles ---
    ws.append(headers)
    for col_num, header_title in enumerate(headers, 1):
        cell = ws.cell(row=1, column=col_num)
        cell.font = header_font
        cell.fill = header_fill
        cell.alignment = header_alignment
        cell.border = thin_border

    # --- 5. Write Data Rows ---
    for row_num, obj in enumerate(queryset, 2):
        row_data = [
            obj.faculty_name,
            obj.department.name if obj.department else 'N/A'
        ]
        for field in fields:
            row_data.append(getattr(obj, field.name))
        
        ws.append(row_data)
        # Apply styles to data cells
        for col_num in range(1, len(headers) + 1):
            cell = ws.cell(row=row_num, column=col_num)
            cell.alignment = cell_alignment
            cell.border = thin_border

    # --- 6. Auto-fit Column Widths ---
    for col_num, header_title in enumerate(headers, 1):
        max_length = 0
        column = get_column_letter(col_num)
        for cell in ws[column]:
            try:
                if len(str(cell.value)) > max_length:
                    max_length = len(str(cell.value))
            except:
                pass
        adjusted_width = (max_length + 2)
        ws.column_dimensions[column].width = adjusted_width

    # --- 7. Create HTTP Response ---
    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    )
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M')
    filename = f"{model_name.replace(' ', '_')}_Report_{timestamp}.xlsx"
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    
    wb.save(response)
    return response

