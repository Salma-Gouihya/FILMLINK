package com.filmapp.controller;

import com.filmlink.FilmlinkApplication;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = FilmlinkApplication.class)
@AutoConfigureMockMvc
public class SwaggerConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void shouldReturnSwaggerUI() throws Exception {
        mockMvc.perform(get("/swagger-ui.html"))
               .andExpect(status().is3xxRedirection()); // Redirige vers /swagger-ui/index.html
    }

    @Test
    public void shouldReturnApiDocs() throws Exception {
        mockMvc.perform(get("/api-docs"))
               .andExpect(status().isOk());
    }
}
