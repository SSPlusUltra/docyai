from collections import defaultdict
import json
def preprocess_excalidraw_elements(canvas_elements):
    elements_by_type = defaultdict(list)
    for element in canvas_elements:
        if not element["isDeleted"]:  
            extracted_properties = {
                "opacity": element["opacity"],
                "fillStyle": element["fillStyle"],
                "strokeColor": element["strokeColor"],
                "text": element["text"] if element["type"] == "text" else None,
                "shape": element["shape"] if element["type"] == "shape" else None,
            }
            elements_by_type[element["type"]].append(extracted_properties)

    json_output = json.dumps(elements_by_type)
    
    return json_output
