{{ range .Versions }}
<a name="{{ .Tag.Name }}"></a>

{{ range .CommitGroups -}}

### {{ .Title }}

{{ range .Commits -}}

- {{ if .Scope }}**{{ .Scope }}:** {{ end }}{{ .Subject }}
  {{ end }}
  {{ end -}}

{{- if .NoteGroups -}}
{{ range .NoteGroups -}}

### {{ .Title }}

{{ range .Notes }}
{{ .Body }}
{{ end }}
{{ end -}}
{{ end -}}
{{ end -}}
