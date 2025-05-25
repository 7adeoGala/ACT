def parse_replay_file(file):
    try:
        content = file.read()
        header = content[:512].decode(errors="ignore")

        data = {
            "header_preview": header[:200],  # texto parcial
            "file_size_bytes": len(content),
        }

        return data
    except Exception as e:
        return {"error": str(e)}
