package com.filmlink.backend;

import com.filmlink.FilmlinkApplication;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = FilmlinkApplication.class)
@ActiveProfiles("test")
class BackendApplicationTests {

    @Test
    void contextLoads() {
        // Test that the application context loads successfully
    }
}
