package main

import (
	"fmt"
	"html/template"
	"net/http"
)

type usuario struct{
	N string
	A string
	E string
}

func index(w http.ResponseWriter, r *http.Request)  {

	//enableCors(&w)
	fmt.Printf("corriendo")
	datas := usuario{"a","x","a"}

	setupResponse(&w, r)

	t := template.Must(template.ParseFiles("index.html"))
	t.Execute(w,datas)

	if (*r).Method == "POST" {
		return
	}

}

func enableCors(w *http.ResponseWriter)  {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func setupResponse(w *http.ResponseWriter, req *http.Request) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers","Content-Type,access-control-allow-origin, access-control-allow-headers")
}

func main() {
	fmt.Printf("corriendo")
	http.Handle("/js/", http.StripPrefix("/js/", http.FileServer(http.Dir("js"))))
	http.Handle("/css/", http.StripPrefix("/css/", http.FileServer(http.Dir("css"))))
	http.HandleFunc("/",index)
	http.ListenAndServe(":8080",nil)

}